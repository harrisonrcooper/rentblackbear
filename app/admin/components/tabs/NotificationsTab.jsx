"use client";

const iconFor = (type) => {
  if (type === "lease") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
        <polyline points="14 2 14 8 20 8"/>
      </svg>
    );
  }
  if (type === "payment") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
      </svg>
    );
  }
  if (type === "maint") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
        <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  );
};

export default function NotificationsTab({ notifs, setNotifs, unreadCount }) {
  const markAllRead = () => setNotifs(p => p.map(x => ({...x, read: true})));
  const markRead = (id) => setNotifs(p => p.map(x => x.id === id ? {...x, read: true} : x));

  return (
    <>
      <div className="sec-hd">
        <div><h2>Notifications</h2><p>{unreadCount} unread</p></div>
        <button className="btn btn-out btn-sm" onClick={markAllRead}>Mark All Read</button>
      </div>
      {notifs.map(n => (
        <div
          key={n.id}
          className="row"
          style={{opacity: n.read ? 0.6 : 1, cursor:"pointer"}}
          onClick={() => markRead(n.id)}
        >
          <span style={{fontSize:16}}>{iconFor(n.type)}</span>
          <div className="row-i">
            <div className="row-t" style={{fontWeight: n.read ? 500 : 700}}>{n.msg}</div>
            <div className="row-s">{n.date}</div>
          </div>
          {!n.read && <div className="notif-dot"/>}
          {n.urgent && <span className="badge b-red">Urgent</span>}
        </div>
      ))}
    </>
  );
}
