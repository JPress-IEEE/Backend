import * as applicantController from '../controllers/applicant.controller';
import { Router } from 'express';
import   { resumeUpload, profilePicUpload } from '../utils/upload.utils';
import { authMiddleware, applicantRoleMiddleware ,adminRoleMiddleware} from '../middlewares/auth.middleware';
import { getApplicants,getApplicant,createApplicant,updateApplicant,deleteApplicant,uploadResume,uploadProfilePic } from '../controllers/applicant.controller';



const applicantRouter = Router();

applicantRouter.get('/',authMiddleware,adminRoleMiddleware,getApplicants);
applicantRouter.get('/:id',authMiddleware,applicantRoleMiddleware, getApplicant);
applicantRouter.post('/',resumeUpload.single('resume'),authMiddleware,applicantRoleMiddleware,createApplicant);
applicantRouter.put('/:id',resumeUpload.single('resume'),authMiddleware,applicantRoleMiddleware, updateApplicant);
applicantRouter.delete('/:id',authMiddleware,applicantRoleMiddleware,deleteApplicant);
applicantRouter.put('/:id/resume',resumeUpload.single('resume'),authMiddleware,applicantRoleMiddleware,uploadResume);
applicantRouter.put('/:id/profile-pic',profilePicUpload.single('profilePic'),authMiddleware,applicantRoleMiddleware,uploadProfilePic);
export default applicantRouter;


