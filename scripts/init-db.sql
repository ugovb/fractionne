CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TYPE user_role AS ENUM('admin', 'athlete');

CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_encrypted TEXT NOT NULL,
  name VARCHAR(100) NOT NULL,
  role user_role DEFAULT 'athlete',
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  name VARCHAR(50) NOT NULL,
  color VARCHAR(7) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE workouts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  name VARCHAR(100) NOT NULL,
  cycles INT NOT NULL,
  run_duration INT NOT NULL,
  rest_duration INT NOT NULL,
  warm_up_duration INT DEFAULT 0,
  cool_down_duration INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE TABLE sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  workout_id UUID REFERENCES workouts(id) ON DELETE SET NULL,
  profile_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  completed_at TIMESTAMP DEFAULT NOW(),
  total_duration INT NOT NULL,
  cycles_completed INT NOT NULL,
  workout_duration INT NOT NULL,
  completed BOOLEAN DEFAULT false
);

CREATE TABLE weight_entries (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  weight DECIMAL(4,1) NOT NULL,
  recorded_at DATE DEFAULT CURRENT_DATE
);

CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_workouts_profile_id ON workouts(profile_id);
CREATE INDEX idx_sessions_user_id ON sessions(user_id);
CREATE INDEX idx_sessions_completed_at ON sessions(completed_at);
CREATE INDEX idx_weight_entries_user_id ON weight_entries(user_id);