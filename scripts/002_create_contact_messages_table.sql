-- Create contact messages table for the contact form
CREATE TABLE IF NOT EXISTS public.contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.contact_messages ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert contact messages
CREATE POLICY "Anyone can submit contact messages" ON public.contact_messages
  FOR INSERT WITH CHECK (true);

-- Only allow service role to read contact messages (for admin purposes)
CREATE POLICY "Service role can read contact messages" ON public.contact_messages
  FOR SELECT USING (auth.jwt() ->> 'role' = 'service_role');
