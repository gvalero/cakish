PRAGMA foreign_keys = ON;

CREATE TABLE orders (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_session_id TEXT NOT NULL UNIQUE,
  customer_name TEXT NOT NULL CHECK (length(customer_name) BETWEEN 1 AND 100),
  customer_email TEXT NOT NULL CHECK (length(customer_email) BETWEEN 3 AND 200),
  collection_date TEXT NOT NULL CHECK (length(collection_date) = 10),
  product TEXT NOT NULL CHECK (length(product) BETWEEN 1 AND 200),
  size TEXT NOT NULL DEFAULT '' CHECK (length(size) <= 200),
  filling TEXT NOT NULL DEFAULT '' CHECK (length(filling) <= 200),
  finish TEXT NOT NULL DEFAULT '' CHECK (length(finish) <= 200),
  topper TEXT NOT NULL DEFAULT '' CHECK (length(topper) <= 100),
  quantity INTEGER NOT NULL DEFAULT 1 CHECK (quantity BETWEEN 1 AND 100),
  customer_note TEXT NOT NULL DEFAULT '' CHECK (length(customer_note) <= 500),
  amount_total INTEGER NOT NULL CHECK (amount_total >= 0),
  currency TEXT NOT NULL CHECK (length(currency) = 3),
  payment_status TEXT NOT NULL CHECK (payment_status IN ('paid', 'no_payment_required')),
  fulfillment_status TEXT NOT NULL DEFAULT 'new'
    CHECK (fulfillment_status IN ('new', 'confirmed', 'baking', 'ready', 'collected', 'cancelled')),
  internal_notes TEXT NOT NULL DEFAULT '' CHECK (length(internal_notes) <= 2000),
  baker_notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (baker_notification_status IN ('pending', 'sending', 'sent', 'failed')),
  baker_notification_attempts INTEGER NOT NULL DEFAULT 0 CHECK (baker_notification_attempts >= 0),
  baker_notification_last_attempt_at TEXT,
  baker_notification_sent_at TEXT,
  baker_notification_error TEXT,
  customer_notification_status TEXT NOT NULL DEFAULT 'pending'
    CHECK (customer_notification_status IN ('pending', 'sending', 'sent', 'failed')),
  customer_notification_attempts INTEGER NOT NULL DEFAULT 0 CHECK (customer_notification_attempts >= 0),
  customer_notification_last_attempt_at TEXT,
  customer_notification_sent_at TEXT,
  customer_notification_error TEXT,
  stripe_created_at TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL
);

CREATE TABLE stripe_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  stripe_event_id TEXT NOT NULL UNIQUE,
  stripe_event_type TEXT NOT NULL,
  stripe_session_id TEXT NOT NULL,
  received_at TEXT NOT NULL,
  FOREIGN KEY (stripe_session_id) REFERENCES orders(stripe_session_id)
);

CREATE INDEX idx_orders_collection_date ON orders(collection_date, id);
CREATE INDEX idx_orders_fulfillment ON orders(fulfillment_status, collection_date, id);
CREATE INDEX idx_orders_created ON orders(created_at DESC, id DESC);
CREATE INDEX idx_events_session ON stripe_events(stripe_session_id);
