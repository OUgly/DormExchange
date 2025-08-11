-- Initial campus data
insert into campuses (name, slug, allowed_domains) values
  ('Ohio University', 'ohio-university', array['ohio.edu']),
  ('Miami University', 'miami-university', array['miamioh.edu']),
  ('Ohio State University', 'ohio-state', array['osu.edu']),
  ('University of Cincinnati', 'uc', array['uc.edu']),
  ('Kent State University', 'kent-state', array['kent.edu']);
