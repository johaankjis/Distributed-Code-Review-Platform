-- Insert sample users
INSERT INTO users (github_id, username, email, avatar_url) VALUES
(1001, 'alice_dev', 'alice@example.com', 'https://avatars.githubusercontent.com/u/1001'),
(1002, 'bob_reviewer', 'bob@example.com', 'https://avatars.githubusercontent.com/u/1002'),
(1003, 'charlie_eng', 'charlie@example.com', 'https://avatars.githubusercontent.com/u/1003'),
(1004, 'diana_lead', 'diana@example.com', 'https://avatars.githubusercontent.com/u/1004'),
(1005, 'eve_senior', 'eve@example.com', 'https://avatars.githubusercontent.com/u/1005')
ON CONFLICT (github_id) DO NOTHING;

-- Insert sample repositories
INSERT INTO repositories (github_id, name, full_name, owner_id, description) VALUES
(2001, 'web-app', 'acme-corp/web-app', 1, 'Main web application'),
(2002, 'api-service', 'acme-corp/api-service', 1, 'Backend API service'),
(2003, 'mobile-app', 'acme-corp/mobile-app', 4, 'Mobile application')
ON CONFLICT (github_id) DO NOTHING;

-- Insert sample pull requests
INSERT INTO pull_requests (github_id, repository_id, number, title, description, author_id, state, base_branch, head_branch, additions, deletions, changed_files, github_url) VALUES
(3001, 1, 101, 'Add user authentication flow', 'Implements OAuth2 authentication with GitHub', 1, 'open', 'main', 'feature/auth', 245, 12, 8, 'https://github.com/acme-corp/web-app/pull/101'),
(3002, 1, 102, 'Fix responsive layout on mobile', 'Fixes CSS issues on mobile devices', 2, 'open', 'main', 'fix/mobile-layout', 89, 34, 5, 'https://github.com/acme-corp/web-app/pull/102'),
(3003, 2, 201, 'Add rate limiting middleware', 'Implements rate limiting for API endpoints', 3, 'open', 'main', 'feature/rate-limit', 156, 8, 4, 'https://github.com/acme-corp/api-service/pull/201'),
(3004, 2, 202, 'Update database schema', 'Adds new tables for analytics', 1, 'open', 'main', 'feature/analytics-db', 312, 45, 12, 'https://github.com/acme-corp/api-service/pull/202'),
(3005, 3, 301, 'Implement push notifications', 'Adds FCM integration for push notifications', 5, 'open', 'main', 'feature/push-notif', 423, 23, 15, 'https://github.com/acme-corp/mobile-app/pull/301')
ON CONFLICT (github_id) DO NOTHING;

-- Insert sample reviews
INSERT INTO reviews (pull_request_id, reviewer_id, status, priority) VALUES
(1, 2, 'in_progress', 'high'),
(1, 4, 'pending', 'high'),
(2, 3, 'completed', 'normal'),
(3, 4, 'in_progress', 'high'),
(4, 2, 'pending', 'normal'),
(4, 5, 'pending', 'normal'),
(5, 3, 'in_progress', 'high');

-- Insert sample notifications
INSERT INTO notifications (user_id, pull_request_id, type, message) VALUES
(2, 1, 'review_assigned', 'You have been assigned to review PR #101'),
(4, 1, 'review_assigned', 'You have been assigned to review PR #101'),
(3, 2, 'review_completed', 'Your review for PR #102 has been submitted'),
(4, 3, 'review_assigned', 'You have been assigned to review PR #201');
