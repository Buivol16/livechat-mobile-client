import { Member } from "./member.models";

export interface UserJoinsEvent{
    correlationId: string;
    member: Member;
}