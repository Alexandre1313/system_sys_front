import { Status } from "./Status";

export default interface FinalyGrade {
    id: number | undefined;
    finalizada: boolean;
    status: Status;
}
