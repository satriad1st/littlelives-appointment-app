/**
 * @file src/context/socket-io.context.tsx
 *
 * @date 28-04-25 - 15:38:57
 * @author Richie Permana <richie.permana@gmail.com>
 */

import React, { createContext, FC, PropsWithChildren, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

type Props = {};

type SocketContextType = {
  socket: Socket | null;
};

const SocketContext = createContext<SocketContextType | undefined>(undefined);

const SocketIoProvider: FC<PropsWithChildren<Props>> = (props) => {
  const { children } = props;
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketInstance = io(process.env.NEXT_PUBLIC_WS_URL);

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }

  return context;
};

export default SocketIoProvider;
