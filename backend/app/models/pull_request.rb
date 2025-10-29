class PullRequest < ApplicationRecord
  belongs_to :repository
  belongs_to :author, class_name: 'User', foreign_key: 'author_id'
  has_many :reviews, dependent: :destroy
  has_many :reviewers, through: :reviews, source: :reviewer
  has_many :reviewer_assignments, dependent: :destroy
  has_many :notifications, dependent: :destroy

  validates :github_id, presence: true, uniqueness: true
  validates :number, presence: true
  validates :title, presence: true

  scope :open, -> { where(state: 'open') }
  scope :closed, -> { where(state: 'closed') }
  scope :merged, -> { where(state: 'merged') }

  def pending_reviews
    reviews.where(status: 'pending')
  end

  def in_progress_reviews
    reviews.where(status: 'in_progress')
  end

  def completed_reviews
    reviews.where(status: 'completed')
  end

  def review_progress_percentage
    total = reviews.count
    return 0 if total.zero?
    
    completed = completed_reviews.count
    (completed.to_f / total * 100).round
  end

  def complexity_score
    # Simple complexity calculation based on changes
    (additions + deletions) / 100.0 + changed_files * 2
  end
end
