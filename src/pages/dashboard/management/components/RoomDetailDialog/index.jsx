import React, { useState, useEffect } from 'react';
import styles from './styles.module.css';
import fetchWithAuth from '@/api/fetchWithAuth';

const RoomDetailDialog = ({
  isOpen,
  onOpenChange,
  room,
  onAddMember,
  onRemoveMember,
  onAddSensor,
  onRemoveSensor,
}) => {
  const [newMemberEmail, setNewMemberEmail] = useState('');
  const [newSensorName, setNewSensorName] = useState('');
  const [newSensorSerial, setNewSensorSerial] = useState('');

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

  useEffect(() => {
    if (isOpen) {
      setNewSensorName('');
      setNewSensorSerial('');
      setNewMemberEmail('');
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddMember = () => {
    if (!newMemberEmail.trim()) return;
    onAddMember(room.id, newMemberEmail);
    setNewMemberEmail('');
  };

  const handleAddSensor = async () => {
    if (!newSensorName.trim() || !newSensorSerial.trim()) {
      alert('센서 이름과 일련번호를 모두 입력해주세요!');
      return;
    }
    try {
      // 1. 센서 자체 등록
      const res = await fetchWithAuth('/api/sensor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: Number(newSensorSerial),
          name: newSensorName,
        }),
      });
      if (!res.ok) {
        alert('센서 등록에 실패했습니다.');
        return;
      }

      // 2. 센서를 방에 매핑
      const mapRes = await fetchWithAuth('/api/sensor/room', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: Number(newSensorSerial),
          roomId: room.id,
        }),
      });
      if (!mapRes.ok) {
        alert('센서를 방에 추가하는 데 실패했습니다.');
        return;
      }

      if (typeof onAddSensor === 'function') {
        await onAddSensor(room.id);
      }
      setNewSensorName('');
      setNewSensorSerial('');
      alert('센서가 등록되었습니다.');
    } catch (e) {
      alert('센서 등록 중 오류가 발생했습니다.');
    }
  };

  const handleRemoveSensor = async (sensor) => {
    if (!window.confirm('정말로 이 센서를 삭제하시겠습니까?')) return;
    try {
      // 1. 방-센서 매핑 해제
      const unmapRes = await fetchWithAuth('/api/sensor/room', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          serialNumber: sensor.serialNumber,
          roomId: room.id,
        }),
      });
      if (!unmapRes.ok) {
        alert('방과의 센서 매핑 해제에 실패했습니다.');
        return;
      }

      if (typeof onRemoveSensor === 'function') {
        await onRemoveSensor(room.id);
      }
      alert('센서가 삭제되었습니다.');
    } catch (e) {
      alert('센서 삭제 중 오류가 발생했습니다.');
    }
  };

  return (
    <div className={styles.overlay} onClick={() => onOpenChange(false)}>
      <div className={styles.dialog} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <h2>{room?.name} 상세 정보</h2>
          <button className={styles.closeButton} onClick={() => onOpenChange(false)}>
            ✕
          </button>
        </div>

        <div className={styles.section}>
          <h3>멤버 관리</h3>
          <div className={styles.addForm}>
            <input
              type="email"
              placeholder="이메일 주소"
              value={newMemberEmail}
              onChange={(e) => setNewMemberEmail(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleAddMember} className={styles.addButton}>
              + 멤버 추가
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>이름</th>
                <th>권한</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {room?.members.map((member) => (
                <tr key={member.userId}>
                  <td>{member.username}</td>
                  <td>{member.roleInRoom || '일반'}</td>
                  <td>
                    <button
                      className={styles.iconButton}
                      onClick={() => onRemoveMember(room.id, member.id)}
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.section}>
          <h3>센서 관리</h3>
          <div className={styles.addForm}>
            <input
              type="text"
              placeholder="센서 이름"
              value={newSensorName}
              onChange={(e) => setNewSensorName(e.target.value)}
              className={styles.input}
            />
            <input
              type="text"
              placeholder="일련번호"
              value={newSensorSerial}
              onChange={(e) => setNewSensorSerial(e.target.value)}
              className={styles.input}
            />
            <button onClick={handleAddSensor} className={styles.addButton}>
              + 센서 추가
            </button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>센서 이름</th>
                <th>타입</th>
                <th>상태</th>
                <th>관리</th>
              </tr>
            </thead>
            <tbody>
              {room?.sensors.map((sensor) => (
                <tr key={sensor.id}>
                  <td>{sensor.name}</td>
                  <td>{sensor.sensorType}</td>
                  <td>
                    <span
                      style={{
                        display: 'inline-block',
                        width: 12,
                        height: 12,
                        borderRadius: '50%',
                        background: sensor.runningStatus ? '#22c55e' : '#ef4444',
                        marginRight: 6,
                        verticalAlign: 'middle',
                      }}
                      title={sensor.runningStatus ? 'Active' : 'Inactive'}
                    />
                    {sensor.runningStatus ? 'Active' : 'Inactive'}
                  </td>
                  <td>
                    <button
                      className={styles.iconButton}
                      onClick={() => handleRemoveSensor(sensor)}
                      title="삭제"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RoomDetailDialog; 