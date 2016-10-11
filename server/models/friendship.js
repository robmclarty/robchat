'use strict'

const STATUS = {
  PENDING: 'pending',
  REQUESTED: 'requested',
  ACCEPTED: 'accepted',
  DECLINED: 'declined',
  REJECTED: 'rejected',
  BANNED: 'banned'
}

values: Object.keys(STATUS).map(key => STATUS[key]),
