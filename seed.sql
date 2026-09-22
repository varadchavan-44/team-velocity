-- Current council (team.html)
INSERT INTO team_members (name, role, category, sort_order) VALUES
  ('Anurag Mishra', 'Captain', 'council', 1),
  ('Arnav Agrawal', 'Manager', 'council', 2),
  ('Srijan Kashyap', 'Design Head', 'council', 3),
  ('Vedant Borhade', 'Fabrication Head', 'council', 4),
  ('Sohana Mokashi', 'Braking Head', 'council', 5),
  ('Aditya Gaddam', 'Powertrain Head', 'council', 6),
  ('Priyanshu Bhagat', 'Steering & Sponsorship Head', 'council', 7),
  ('Vikash Kumar', 'Media Head', 'council', 8),
  ('Varad Kaulwar', 'Logistics & Maintenance Head', 'council', 9);

-- Advisory council 2025-26
INSERT INTO team_members (name, role, category, sort_order) VALUES
  ('Sanket Shimpi', 'Captain', 'advisory', 1),
  ('Chaitanya Shendge', 'Vice-Captain', 'advisory', 2),
  ('Pravar Jain', 'Treasurer', 'advisory', 3),
  ('Sakshi Satpute', 'Design Head', 'advisory', 4),
  ('Srushti Bakare', 'Design Head', 'advisory', 5),
  ('Gayathri Putti', 'Fabrication Head', 'advisory', 6),
  ('Ajinkya Jadhav', 'Fabrication Head', 'advisory', 7),
  ('Swaraj Kalghatgi', 'Sponsorship Head', 'advisory', 8),
  ('Arya Landge', 'Social Media & Alumni Head', 'advisory', 9);

-- Homepage editable sections, seeded with current copy
INSERT INTO homepage_content (key, data) VALUES
  ('hero', '{
    "eyebrow": "VNIT Nagpur",
    "heading_html": "There is no factory.<br>Just <em>us.</em>",
    "subtext": "We design and manufacture a race car every year—then take it to the track."
  }'::jsonb),
  ('update', '{
    "status_label": "Current build / 01",
    "date_label": "October / Coimbatore",
    "heading_html": "Morphine Motorsports<br>Coimbatore.",
    "body": "We are fabricating our next car for the Morphine Motorsport Series in Coimbatore this October—taking the design from the workshop to the grid."
  }'::jsonb),
  ('partner', '{
    "eyebrow": "For partners",
    "heading": "Make the next lap possible.",
    "subtext": "Put your brand beside the work that turns students into engineers."
  }'::jsonb)
ON CONFLICT (key) DO NOTHING;
