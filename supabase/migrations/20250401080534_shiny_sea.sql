/*
  # Create letters table and policies

  1. New Tables
    - `letters`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `title` (text)
      - `content` (text)
      - `type` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on `letters` table
    - Add policies for authenticated users to manage their own letters
*/

-- Create letters table if it doesn't exist
CREATE TABLE IF NOT EXISTS letters (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  content text NOT NULL,
  type text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE letters ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DO $$ 
BEGIN
    DROP POLICY IF EXISTS "Users can view their own letters" ON letters;
    DROP POLICY IF EXISTS "Users can create their own letters" ON letters;
    DROP POLICY IF EXISTS "Users can update their own letters" ON letters;
    DROP POLICY IF EXISTS "Users can delete their own letters" ON letters;
END $$;

-- Create policies
CREATE POLICY "Users can view their own letters"
  ON letters
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own letters"
  ON letters
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own letters"
  ON letters
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own letters"
  ON letters
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Drop existing trigger if it exists
DROP TRIGGER IF EXISTS letters_updated_at ON letters;
DROP FUNCTION IF EXISTS update_letters_updated_at();

-- Create trigger function
CREATE OR REPLACE FUNCTION update_letters_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
CREATE TRIGGER letters_updated_at
  BEFORE UPDATE ON letters
  FOR EACH ROW
  EXECUTE FUNCTION update_letters_updated_at();