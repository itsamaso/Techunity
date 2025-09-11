import { useState, useEffect } from 'react';

// Simple hook to manage online status
// In a real app, this would connect to a WebSocket or presence service
export const useOnlineStatus = () => {
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    // Simulate online users - in a real app, this would come from a real-time service
    // For demo purposes, we'll assume all users are online
    const simulateOnlineUsers = () => {
      // This would typically come from your user data or a real-time service
      const allUserIds = [
        'current_user_id',
        'test_user_id',
        'osama_user_id',
        'admin_user_id'
      ];
      setOnlineUsers(allUserIds);
    };

    simulateOnlineUsers();

    // In a real app, you would set up WebSocket listeners here
    // Example:
    // const ws = new WebSocket('ws://your-presence-service.com');
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'user_online') {
    //     setOnlineUsers(prev => [...prev, data.userId]);
    //   } else if (data.type === 'user_offline') {
    //     setOnlineUsers(prev => prev.filter(id => id !== data.userId));
    //   }
    // };

    // Cleanup
    return () => {
      // ws.close();
    };
  }, []);

  const isUserOnline = (userId: string) => {
    return onlineUsers.includes(userId);
  };

  const getOnlineCount = (userIds: string[]) => {
    return userIds.filter(id => isUserOnline(id)).length;
  };

  return {
    onlineUsers,
    isUserOnline,
    getOnlineCount
  };
};
