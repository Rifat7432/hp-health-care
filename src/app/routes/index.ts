import { Router } from 'express';
import { userRoute } from '../modules/User/user.routes';
import { adminRoute } from '../modules/Admin/admin.route';
import { authRoutes } from '../modules/Auth/auth.route';
import { DoctorRoutes } from '../modules/doctor/doctor.route';
import { PatientRoutes } from '../modules/patient/patient.route';
import { SpecialtiesRoutes } from '../modules/specialties/specialties.route';
import { AppointmentRoutes } from '../modules/appointment/appointment.routes';
import { ScheduleRoutes } from '../modules/schedule/schedule.route';
import { DoctorScheduleRoutes } from '../modules/doctorSchedule/doctorSchedule.route';
import { paymentRoutes } from '../modules/payment/payment.routes';
import { ReviewRoutes } from '../modules/review/review.route';
import { PrescriptionsRoutes } from '../modules/prescription/prescription.route';
import { MetaRoutes } from '../modules/meta/meta.routes';



const router = Router();

const moduleRoutes = [
  {
    path: '/auth',
    route: authRoutes,
  },
  {
    path: '/user',
    route: userRoute,
  },
  {
    path: '/doctor',
    route: DoctorRoutes,
  },
  {
    path: '/admin',
    route: adminRoute,
  },
  {
    path: '/patient',
    route: PatientRoutes,
  },
  {
    path: '/specialties',
    route: SpecialtiesRoutes,
  },
  {
    path: '/appointment',
    route: AppointmentRoutes,
  },
  {
    path: '/schedule',
    route: ScheduleRoutes,
  },
  {
    path: '/doctor-schedule',
    route: DoctorScheduleRoutes,
  },
  {
    path: '/payment',
    route: paymentRoutes,
  },
  {
    path: '/prescription',
    route: PrescriptionsRoutes,
  },
  {
    path: '/review',
    route: ReviewRoutes,
  },
  {
    path: '/metadata',
    route: MetaRoutes,
  }
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));


export default router;
