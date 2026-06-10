-- ===================================
-- חסדי המלך — Schema PostgreSQL
-- ===================================

-- פניות
CREATE TABLE IF NOT EXISTS contacts (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    email       TEXT DEFAULT '',
    phone       TEXT DEFAULT '',
    message     TEXT NOT NULL,
    replied     BOOLEAN DEFAULT FALSE,
    reply_text  TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- מתנדבים
CREATE TABLE IF NOT EXISTS volunteers (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    phone       TEXT NOT NULL,
    email       TEXT DEFAULT '',
    city        TEXT NOT NULL,
    has_car     BOOLEAN DEFAULT FALSE,
    notes       TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- קיר תודות
CREATE TABLE IF NOT EXISTS thank_you_notes (
    id           SERIAL PRIMARY KEY,
    display_name TEXT DEFAULT 'אנונימי',
    message      TEXT NOT NULL,
    status       TEXT DEFAULT 'pending',  -- pending | approved | rejected
    created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- סטטיסטיקות ידניות
CREATE TABLE IF NOT EXISTS stats (
    key   TEXT PRIMARY KEY,
    value INTEGER DEFAULT 0
);

INSERT INTO stats (key, value) VALUES
    ('children_count',  350),
    ('hospitals_count', 5),
    ('books_count',     200),
    ('games_count',     500)
ON CONFLICT (key) DO NOTHING;

-- מדיה (תמונות + סרטונים)
CREATE TABLE IF NOT EXISTS media (
    id            SERIAL PRIMARY KEY,
    filename      TEXT NOT NULL,
    original_name TEXT NOT NULL,
    title         TEXT DEFAULT '',
    description   TEXT DEFAULT '',
    category      TEXT DEFAULT 'general',  -- books | toys | food | preparation | videos | general
    type          TEXT DEFAULT 'photo',    -- photo | video
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- ביקורים בדפים
CREATE TABLE IF NOT EXISTS page_visits (
    id         SERIAL PRIMARY KEY,
    path       TEXT NOT NULL,
    visited_at TIMESTAMPTZ DEFAULT NOW()
);

-- תרומות
CREATE TABLE IF NOT EXISTS donations (
    id          SERIAL PRIMARY KEY,
    donor_name  TEXT DEFAULT 'אנונימי',
    amount      NUMERIC(10,2) NOT NULL,
    method      TEXT DEFAULT 'bit',   -- bit | paybox | cash | bank | other
    note        TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- פוסטים לגלריה
CREATE TABLE IF NOT EXISTS gallery_posts (
    id          SERIAL PRIMARY KEY,
    title       TEXT NOT NULL DEFAULT '',
    body        TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- קישור מדיה לפוסט
ALTER TABLE media ADD COLUMN IF NOT EXISTS post_id INTEGER REFERENCES gallery_posts(id) ON DELETE SET NULL;

-- עלוני שבת
CREATE TABLE IF NOT EXISTS newsletters (
    id            SERIAL PRIMARY KEY,
    title         TEXT NOT NULL DEFAULT '',
    parasha_name  TEXT DEFAULT '',
    filename      TEXT NOT NULL,
    original_name TEXT NOT NULL,
    file_type     TEXT DEFAULT 'application/pdf',
    week_of       DATE,
    created_at    TIMESTAMPTZ DEFAULT NOW()
);

-- רשימת קניות
CREATE TABLE IF NOT EXISTS shopping_list (
    id          SERIAL PRIMARY KEY,
    name        TEXT NOT NULL,
    quantity    TEXT DEFAULT '',
    done        BOOLEAN DEFAULT FALSE,
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- הוספת עמודות לקיר תודות
ALTER TABLE thank_you_notes ADD COLUMN IF NOT EXISTS email TEXT DEFAULT '';
ALTER TABLE thank_you_notes ADD COLUMN IF NOT EXISTS photo_filename TEXT DEFAULT '';
ALTER TABLE thank_you_notes ADD COLUMN IF NOT EXISTS hospital TEXT DEFAULT '';

-- יומן פעילות
CREATE TABLE IF NOT EXISTS activity_log (
    id          SERIAL PRIMARY KEY,
    action      TEXT NOT NULL,
    details     TEXT DEFAULT '',
    created_at  TIMESTAMPTZ DEFAULT NOW()
);

-- מעקב הורדות עלון
ALTER TABLE newsletters ADD COLUMN IF NOT EXISTS downloads INTEGER DEFAULT 0;

-- מטמון תרגומים (DeepL)
CREATE TABLE IF NOT EXISTS translations (
    id              SERIAL PRIMARY KEY,
    source_text     TEXT NOT NULL,
    lang            CHAR(2) NOT NULL,
    translated_text TEXT NOT NULL,
    created_at      TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(source_text, lang)
);
