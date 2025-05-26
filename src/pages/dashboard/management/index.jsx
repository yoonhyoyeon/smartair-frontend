import React, { useState, useEffect } from 'react';
import styles from './index.module.css';
import RoomTable from './components/RoomTable';
import RoomCreateDialog from './components/RoomCreateDialog';
import RoomJoinDialog from './components/RoomJoinDialog';
import RoomDetailDialog from './components/RoomDetailDialog';
import IconAlertCircle from '@/assets/images/IconAlertCircle.svg?react';
import fetchWithAuth from '@/api/fetchWithAuth';

const DashboardManagement = () => {
  const [rooms, setRooms] = useState([]);

  const [isCreateRoomOpen, setIsCreateRoomOpen] = useState(false);
  const [isJoinRoomOpen, setIsJoinRoomOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [newRoomName, setNewRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [deviceControlEnabled, setDeviceControlEnabled] = useState(true);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  // 방 목록 API 연동
  const fetchRooms = async () => {
    try {
      const response = await fetchWithAuth('/api/api/room/rooms');
      const data = await response.json();
      const roomList = Array.isArray(data) ? data : data.content || [];
      const roomsWithDetails = await Promise.all(
        roomList.map(async (room) => {
          let sensors = [];
          try {
            const sensorsRes = await fetchWithAuth(`/api/api/room/${room.id}/sensors`);
            sensors = await sensorsRes.json();
          } catch {}
          let members = [];
          try {
            const membersRes = await fetchWithAuth(`/api/api/room/${room.id}/participants`);
            members = await membersRes.json();
          } catch {}
          return {
            ...room,
            sensors: Array.isArray(sensors) ? sensors : [],
            members: Array.isArray(members) ? members : [],
          };
        })
      );
      setRooms(roomsWithDetails);
    } catch (e) {
      setRooms([]);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleEditRoom = (room) => {
    setSelectedRoom(room);
    setNewRoomName(room.name);
    setIsEditRoomOpen(true);
  };

  const handleUpdateRoom = () => {
    if (!newRoomName.trim() || !selectedRoom) return;
    setRooms(rooms.map(room =>
      room.id === selectedRoom.id
        ? { ...room, name: newRoomName }
        : room
    ));
    setNewRoomName('');
    setSelectedRoom(null);
    setIsEditRoomOpen(false);
  };

  const handleDeleteRoom = (roomId) => {
    if (window.confirm('정말로 이 방을 삭제하시겠습니까?')) {
      setRooms(rooms.filter(room => room.id !== roomId));
    }
  };

  const handleViewDetail = (room) => {
    setSelectedRoom(room);
    setIsDetailOpen(true);
  };

  const handleAddMember = (roomId, email) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          members: [
            ...room.members,
            {
              id: Date.now().toString(),
              name: email.split('@')[0],
              email,
            },
          ],
        };
      }
      return room;
    }));
  };

  const handleRemoveMember = (roomId, memberId) => {
    setRooms(rooms.map(room => {
      if (room.id === roomId) {
        return {
          ...room,
          members: room.members.filter(member => member.id !== memberId),
        };
      }
      return room;
    }));
  };

  const updateRoomSensors = async (roomId) => {
    try {
      const sensorsRes = await fetchWithAuth(`/api/api/room/${roomId}/sensors`);
      const sensors = await sensorsRes.json();
      console.log('센서 업데이트: ',sensors);
      setRooms(rooms =>
        rooms.map(room =>
          room.id === roomId
            ? { ...room, sensors: Array.isArray(sensors) ? sensors : [] }
            : room
        )
      );
      setSelectedRoom((prev) => ({ ...prev, sensors: Array.isArray(sensors) ? sensors : [] }));
    } catch {
      // 실패 시 기존 센서 목록 유지
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>
          방 관리
          <IconAlertCircle />
        </h1>
        <div className={styles.buttonContainer}>
          <button className={styles.addButton} onClick={() => setIsCreateRoomOpen(true)}>
            방 생성
          </button>
          <button className={styles.addButton} onClick={() => setIsJoinRoomOpen(true)}>
            방 참여
          </button>
        </div>
      </div>

      <RoomTable
        rooms={rooms}
        onEdit={handleEditRoom}
        onDelete={handleDeleteRoom}
        onViewDetail={handleViewDetail}
      />

      <RoomCreateDialog
        isOpen={isCreateRoomOpen}
        onOpenChange={setIsCreateRoomOpen}
        onRefresh={fetchRooms}
      />

      <RoomJoinDialog
        isOpen={isJoinRoomOpen}
        onOpenChange={setIsJoinRoomOpen}
        onRefresh={fetchRooms}
      />

      <RoomDetailDialog
        isOpen={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        room={selectedRoom}
        onAddMember={handleAddMember}
        onRemoveMember={handleRemoveMember}
        onAddSensor={updateRoomSensors}
        onRemoveSensor={updateRoomSensors}
      />
    </div>
  );
};

export default DashboardManagement; 