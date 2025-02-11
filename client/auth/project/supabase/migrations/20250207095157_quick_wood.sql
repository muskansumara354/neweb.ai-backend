/*
  # Create websites table for the website builder

  1. New Tables
    - `websites`
      - `id` (uuid, primary key)
      - `created_at` (timestamp)
      - `user_id` (uuid, references auth.users)
      - `name` (text)
      - `content` (jsonb)
      - `published` (boolean)
      - `domain` (text)

  2. Security
    - Enable RLS on `websites` table
    - Add policies for CRUD operations
*/

CREATE TABLE IF NOT EXISTS websites (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users NOT NULL,
  name text NOT NULL,
  content jsonb DEFAULT '{}'::jsonb,
  published boolean DEFAULT false,
  domain text
);

ALTER TABLE websites ENABLE ROW LEVEL SECURITY;

-- Allow users to read their own websites
CREATE POLICY "Users can read own websites"
  ON websites
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Allow users to insert their own websites
CREATE POLICY "Users can insert own websites"
  ON websites
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own websites
CREATE POLICY "Users can update own websites"
  ON websites
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own websites
CREATE POLICY "Users can delete own websites"
  ON websites
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);