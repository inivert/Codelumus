CREATE TABLE support_messages (
  id TEXT PRIMARY KEY,
  subject TEXT NOT NULL,
  website TEXT NOT NULL,
  message TEXT NOT NULL,
  user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX support_messages_user_id_idx ON support_messages(user_id); 