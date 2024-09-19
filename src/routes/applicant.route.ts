import * as applicantController from '../controllers/applicant.controller';
import { Router } from 'express';
import   { resumeUpload, profilePicUpload } from '../utils/upload.utils';
import { authMiddleware, applicantRoleMiddleware ,adminRoleMiddleware} from '../middlewares/auth.middleware';
import { getApplicants,getApplicant,createApplicant,updateApplicant,deleteApplicant,uploadResume,uploadProfilePic } from '../controllers/applicant.controller';



const applicantRouter = Router();

applicantRouter.get('/',authMiddleware,adminRoleMiddleware,getApplicants);
applicantRouter.get('/:id',authMiddleware,applicantRoleMiddleware, getApplicant);
applicantRouter.post('/',authMiddleware,applicantRoleMiddleware,createApplicant);
applicantRouter.put('/:id',authMiddleware,applicantRoleMiddleware, updateApplicant);
applicantRouter.delete('/:id',authMiddleware,applicantRoleMiddleware,deleteApplicant);
applicantRouter.put('/:id/resume',authMiddleware,applicantRoleMiddleware,resumeUpload.single('resume'),uploadResume);
applicantRouter.put('/:id/profilePic',authMiddleware,applicantRoleMiddleware,profilePicUpload.single('profilePic'),uploadProfilePic);
export default applicantRouter;


