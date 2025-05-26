import React, { useEffect, useState } from 'react';
import styles from './styles.module.css';

const RoomJoinDialog = ({
  isOpen,
  onOpenChange,
  onRefresh,
}) => {
  const [roomName, setRoomName] = useState('');
  const [roomPassword, setRoomPassword] = useState('');
  const [deviceControlEnabled, setDeviceControlEnabled] = useState(false);
  const [latitude, setLatitude] = useState('');
  const [longitude, setLongitude] = useState('');

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  const handleAddRoom = async (e) => {
    e.preventDefault();
    if (!roomName.trim() || !roomPassword.trim() || !latitude || !longitude) {
      alert('모든 필드를 입력해주세요.');
      return;
    }
    try {
      const res = await fetchWithAuth('/api/api/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: roomName,
          password: roomPassword,
          deviceControlEnabled,
          latitude: Number(latitude),
          longitude: Number(longitude),
        }),
      });
      if (!res.ok) {
        alert('방 생성에 실패했습니다.');
        return;
      }
      alert('방이 생성되었습니다.');
      onRefresh();
    } catch (e) {
      alert('방 생성 중 오류가 발생했습니다.');
    }
  };


  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>방 생성</h2>
          <button className={styles.closeButton} onClick={() => onOpenChange(false)}>
            ✕
          </button>
        </div>
        <div className={styles.content}>
          <form onSubmit={handleAddRoom}>
            <input
              type="text"
              placeholder="방 이름을 입력하세요"
              value={roomName}
              onChange={(e) => setRoomName(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="password"
              placeholder="방 비밀번호를 입력하세요"
              value={roomPassword}
              onChange={(e) => setRoomPassword(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="number"
              placeholder="방 위도를 입력하세요"
              value={latitude}
              onChange={(e) => setLatitude(e.target.value)}
              className={styles.input}
              required
            />
            <input
              type="number"
              placeholder="방 경도를 입력하세요"
              value={longitude}
              onChange={(e) => setLongitude(e.target.value)}
              className={styles.input}
              required
            />
            <div className={styles.checkboxContainer}>
              <input
                type="checkbox"
                checked={deviceControlEnabled}
                onChange={(e) => setDeviceControlEnabled(e.target.checked)}
              /><label>장치 제어 활성화</label>
            </div>
            <button type="submit" className={styles.submitButton}>
              생성
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomJoinDialog; 