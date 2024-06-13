import { AppointmentStatus, userRole } from "@prisma/client";
import httpStatus from "http-status";
import { prisma } from "../../../app";
import { JwtPayload } from "jsonwebtoken";
import { AppError } from "../../../errors/appErrors";

const fetchDashboardMetadata = async (user: any) => {
    let metadata;
    switch (user.role) {
        case userRole.ADMIN:
            metadata = await getAdminDashboardMetadata();
            break;
        case userRole.SUPER_ADMIN:
            metadata = await getSuperAdminDashboardMetadata();
            break;
        case userRole.DOCTOR:
            metadata = await getDoctorDashboardMetadata(user);
            break;
        case userRole.PATIENT:
            metadata = await getPatientDashboardMetadata(user);
            break;
        default:
            throw new Error('Invalid user role');
    }

    return metadata;
}

const getAdminDashboardMetadata = async () => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const paymentCount = await prisma.payment.count();
    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true }
    });

    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();

    return { appointmentCount, patientCount, doctorCount, paymentCount, totalRevenue, barChartData, pieChartData };
}

const getSuperAdminDashboardMetadata = async () => {
    const appointmentCount = await prisma.appointment.count();
    const patientCount = await prisma.patient.count();
    const doctorCount = await prisma.doctor.count();
    const adminCount = await prisma.admin.count();
    const paymentCount = await prisma.payment.count();
    const totalRevenue = await prisma.payment.aggregate({
        _sum: { amount: true }
    });

    const barChartData = await getBarChartData();
    const pieChartData = await getPieChartData();

    return { appointmentCount, patientCount, doctorCount, adminCount, paymentCount, totalRevenue, barChartData, pieChartData };
}

const getDoctorDashboardMetadata = async (user: JwtPayload) => {
    const doctor = await prisma.doctor.findUnique({
        where: {
            email: user?.email
        }
    });

    if (!doctor) {
        throw new Error('Doctor not found');
    }

    const appointmentCount = await prisma.appointment.count({
        where: {
            doctorId: doctor.id
        }
    });

    const patientCount = await prisma.appointment.groupBy({
        by: ['patientId'],
        _count: {
            id: true
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            doctorId: doctor.id
        }
    });

    const totalRevenue = await prisma.payment.aggregate({
        _sum: {
            amount: true
        },
        where: {
            appointment: {
                doctorId: doctor.id
            }
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            doctorId: doctor.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));

    return {
        appointmentCount,
        patientCount: patientCount.length,
        reviewCount,
        totalRevenue,
        appointmentStatusDistribution: formattedAppointmentStatusDistribution
    };
}


const getPatientDashboardMetadata = async (user: JwtPayload) => {
    const patient = await prisma.patient.findUnique({
        where: {
            email: user?.email
        }
    });

    if (!patient) {
        throw new AppError(httpStatus.BAD_REQUEST, "Patient not found!")
    }

    const appointmentCount = await prisma.appointment.count({
        where: {
            patientId: patient.id
        }
    });

    const prescriptionCount = await prisma.prescription.count({
        where: {
            patientId: patient.id
        }
    });

    const reviewCount = await prisma.review.count({
        where: {
            patientId: patient.id
        }
    });

    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
        where: {
            patientId: patient.id
        }
    });

    const formattedAppointmentStatusDistribution = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id)
    }));

    return {
        appointmentCount,
        reviewCount,
        prescriptionCount,
        appointmentStatusDistribution: formattedAppointmentStatusDistribution
    };
}

const getBarChartData = async () => {
    const appointmentCountByMonth: { month: Date, count: bigint }[] = await prisma.$queryRaw`
        SELECT DATE_TRUNC('month', "createdAt") AS month,
               COUNT(*) AS count
        FROM "appointments"
        GROUP BY month
        ORDER BY month ASC
    `;

    const formattedMetadata = appointmentCountByMonth.map(({ month, count }) => ({
        month,
        count: Number(count), // Convert BigInt to integer
    }));
    return formattedMetadata;
}


const getPieChartData = async () => {
    const appointmentStatusDistribution = await prisma.appointment.groupBy({
        by: ['status'],
        _count: { id: true },
    });

    const formattedData = appointmentStatusDistribution.map(({ status, _count }) => ({
        status,
        count: Number(_count.id), // Convert BigInt to integer
    }));

    return formattedData;
}

export const metaServices = {
    fetchDashboardMetadata
}
