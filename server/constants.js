// Centralized constants — avoid magic strings throughout the codebase

const ROLES = {
  STUDENT: 'student',
  ADMIN: 'admin',
};

const ENROLLMENT_STATUS = {
  PENDING: 'pending',
  ACTIVE: 'active',
  EXPIRED: 'expired',
  REJECTED: 'rejected',
};

const ENROLLMENT_TYPE = {
  KABADDI: 'kabaddi',
  GYM: 'gym',
  BOTH: 'both',
};

const PLAN_TYPE = {
  TRAINING: 'training',
  HOSTEL: 'hostel',
};

const PAYMENT_STATUS = {
  CREATED: 'created',
  PAID: 'paid',
  FAILED: 'failed',
  REFUNDED: 'refunded',
};

const PLAN_NAMES = {
  KABADDI_TRAINING: 'kabaddi-training',
  KABADDI_HOSTEL: 'kabaddi-hostel',
  GYM_MONTHLY: 'gym-monthly',
  GYM_QUARTERLY: 'gym-quarterly',
  COMBO: 'combo',
  ADMISSION: 'admission',
};

const ATTENDANCE_STATUS = {
  PRESENT: 'present',
  ABSENT: 'absent',
  LEAVE: 'leave',
};

const NOTICE_TARGET = {
  ALL: 'all',
  KABADDI: 'kabaddi',
  GYM: 'gym',
  ADMIN: 'admin',
};

const NOTICE_PRIORITY = {
  NORMAL: 'normal',
  URGENT: 'urgent',
};

// Derive plan name from enrollment type + plan
function getPlanName(enrollmentType, plan) {
  if (enrollmentType === ENROLLMENT_TYPE.GYM) return PLAN_NAMES.GYM_MONTHLY;
  if (enrollmentType === ENROLLMENT_TYPE.BOTH) return PLAN_NAMES.COMBO;
  if (plan === PLAN_TYPE.HOSTEL) return PLAN_NAMES.KABADDI_HOSTEL;
  return PLAN_NAMES.KABADDI_TRAINING;
}

// Format current month as YYYY-MM
function getCurrentMonth(date = new Date()) {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
}

module.exports = {
  ROLES,
  ENROLLMENT_STATUS,
  ENROLLMENT_TYPE,
  PLAN_TYPE,
  PAYMENT_STATUS,
  PLAN_NAMES,
  ATTENDANCE_STATUS,
  NOTICE_TARGET,
  NOTICE_PRIORITY,
  getPlanName,
  getCurrentMonth,
};
