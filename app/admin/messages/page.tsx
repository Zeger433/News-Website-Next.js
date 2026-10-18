"use client";

import { useEffect, useState } from "react";

export default function AdminMessages() {
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchMessages() {
      try {
        // Note: You'll need to create GET /api/contact endpoint
        const res = await fetch("/api/contact");
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching messages:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchMessages();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h1>Contact Messages</h1>
      {messages.length === 0 ? (
        <p>No messages yet</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Message</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {messages.map((msg: any) => (
              <tr key={msg.id}>
                <td>{msg.name}</td>
                <td>{msg.email}</td>
                <td>{msg.message}</td>
                <td>{msg.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}