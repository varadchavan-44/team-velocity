ALTER TABLE team_members DROP CONSTRAINT IF EXISTS team_members_category_check;
ALTER TABLE team_members ADD CONSTRAINT team_members_category_check CHECK (category IN ('council', 'advisory', 'team'));
