class ReviewerAssignment < ApplicationRecord
  belongs_to :pull_request
  belongs_to :reviewer, class_name: 'User', foreign_key: 'reviewer_id'
  belongs_to :assigned_by, class_name: 'User', foreign_key: 'assigned_by_id', optional: true

  validates :assignment_reason, presence: true
end
