import React from 'react';
import styles from './styles.module.css';

const RoomTable = ({ rooms, onEdit, onDelete, onViewDetail }) => {
  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>방 이름</th>
          <th>멤버 수</th>
          <th>센서 수</th>
          <th>관리</th>
        </tr>
      </thead>
      <tbody>
        {rooms.map((room) => (
          <tr
            key={room.id}
            className={styles.clickableRow}
            onClick={() => onViewDetail(room)}
            tabIndex={0}
          >
            <td>{room.name}</td>
            <td>{room.members.length}명</td>
            <td>{room.sensors.length}개</td>
            <td>
              <button
                className={`${styles.iconButton} ${styles.editButton}`}
                onClick={e => { e.stopPropagation(); onEdit(room); }}
                title="수정"
              >
                이름 수정
              </button>
              <button
                className={`${styles.iconButton} ${styles.deleteButton}`}
                onClick={e => { e.stopPropagation(); onDelete(room.id); }}
                title="삭제"
              >
                삭제
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default RoomTable; 