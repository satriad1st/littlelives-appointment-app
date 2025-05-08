import { io } from "@be/socket"

export const sendWSMessage = (event: string, message: any, to?: string) => {
    if (io) {
        if (to) {
            io.to(to?.toString()).emit(event, message);
        } else {
            io.emit(event, message);
        }
    }
}