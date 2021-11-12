import {TUser} from "./user-service";
import {TProject} from "./project-service";
// import {TAnnouncement} from "./announcement-service";

type TUserErrorMassage = {
    firstName: string;
    lastName: string;
    userName?: string;
    defaultEmail: string;
    phoneNumber?: string;
}

type TProjectErrorMassage = {
    projectName: string;
    description: string;
    logoPathId: string;
    startDate?: string;
    endDate?: string;
    teamLead?: string;
}

type TAnnouncementErrorMassage = {
    title: string;
    description: string;
}

class ValidateService {
    isValidRequired(inputValue: string) {
        return inputValue === '';
    }

    isValidPattern(inputValue: string, regex: RegExp) {
        return inputValue && !regex.test(inputValue);
    }

    isValidMaxLength(inputValue: string, maxLength: number) {
        return inputValue.length <= maxLength;
    }

    isValidMinLength(inputValue: string, minLength: number) {
        return inputValue.length >= minLength;
    }

    userInputValidation(newUser: TUser) {
        const regEmail = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        const userErrorMassage = {} as TUserErrorMassage;
        if (this.isValidRequired(newUser.firstName)) {
            userErrorMassage.firstName = "First name is required!";
        }
        if (this.isValidRequired(newUser.lastName)) {
            userErrorMassage.lastName = "Last name is required!";
        }
        // if (this.isValidRequired(newUser.userName)) {
        //     userErrorMassage.userName = "Username is required!";
        // }
        if (this.isValidRequired(newUser.defaultEmail)) {
            userErrorMassage.defaultEmail = "Email is required!";
        }
        if (this.isValidPattern(newUser.defaultEmail, regEmail)) {
            userErrorMassage.defaultEmail = "Invalid email!";
        }
        if (this.isValidRequired(newUser.phoneNumber)) {
            userErrorMassage.phoneNumber = "Phone number is required!";
        }
        return userErrorMassage;
    }

    projectInputValidation(newProject: TProject) {
        const projectErrorMassage = {} as TProjectErrorMassage;

        if (this.isValidRequired(newProject.projectName)) {
            projectErrorMassage.projectName = "Project name is required!";
        }
        if (this.isValidRequired(newProject.description)) {
            projectErrorMassage.description = "Project description is required!";
        }
        return projectErrorMassage;
    }

    announcementInputValidation(newAnnouncement: any) {
        const announcementErrorMassage = {} as TAnnouncementErrorMassage;

        if (this.isValidRequired(newAnnouncement.title)) {
            announcementErrorMassage.title = "Title is required!";
        }
        if (this.isValidRequired(newAnnouncement.description)) {
            announcementErrorMassage.description = "Description is required!";
        }
        // if (newAnnouncement.description && typeof(newAnnouncement.description) !== "string") {
        //     if (this.isValidRequired(newAnnouncement?.description?.blocks[0].text)) {
        //         announcementErrorMassage.description = "Description is required!";
        //     }
        // }
        return announcementErrorMassage;
    }

}

export default new ValidateService();