CREATE TYPE ROLE AS ENUM('admin', 'reader', 'banned');

CREATE TYPE CONTENT AS ENUM('article', 'photo', 'video', 'thought');

CREATE TYPE COMMUNICATION AS ENUM(
  'email',
  'wechat',
  'telegram',
  'twitter',
  'line',
  'whatsapp'
);

CREATE TABLE
  config (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" VARCHAR(255) NOT NULL,
    "value" TEXT NOT NULL,
    CONSTRAINT name_format CHECK (name ~ '^[A-Z0-9]+(_[A-Z0-9]+)*$')
  );

CREATE UNIQUE INDEX ON config ("name");

INSERT INTO config ("name", "value") VALUES ('PROMPT_SEO',
'请总结以下文本，使之不超过120字，用于SEO优化。确保内容既精准又简洁。');

INSERT INTO config ("name", "value") VALUES ('PROMPT_SLUG',
'请将文章的标题翻译成英文，使用全小写字母，并用连字符“-”替代空格，以创建一个适合作为网页slug的简洁版本。如果翻译后的标题过长，适当缩短它，确保保留关键信息，并使其含义依然清晰。例如，将“我的2024年总结”转换为“my-2024-summary”。');

CREATE TABLE
  language (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" TEXT UNIQUE,
    "locale" TEXT UNIQUE,
    "is_default" BOOLEAN DEFAULT false
  );

CREATE UNIQUE INDEX ON language ("lang");

INSERT INTO
  language ("lang", "locale", "is_default")
VALUES
  ('zh-CN', '简体中文', TRUE);

CREATE TABLE
  users (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "user_id" UUID UNIQUE,
    "name" TEXT,
    "source" TEXT,
    "current_ip" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "role" ROLE DEFAULT 'reader',
    FOREIGN KEY ("user_id") REFERENCES auth.users ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE UNIQUE INDEX ON users ("user_id");

CREATE TABLE
  image (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "folder" TEXT,
    "file_name" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "date" TEXT,
    "format" TEXT,
    "exif" JSON,
    "gps" JSON,
    "location" TEXT,
    "taken_at" TIMESTAMPTZ,
    "width" SMALLINT,
    "height" SMALLINT,
    "size" INT,
    "has_alpha" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "storage_key" UUID NOT NULL DEFAULT uuid_generate_v4 (),
    UNIQUE ("date", "file_name", "format")
  );

CREATE INDEX ON image ("date", "file_name", "format");

CREATE UNIQUE INDEX ON image ("storage_key");

ALTER TABLE image
ADD CONSTRAINT unique_image UNIQUE (storege_key);

CREATE TABLE
  topic (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" BIGINT,
    "slug" TEXT,
    "title" TEXT,
    "count" INT DEFAULT 0,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE ("lang", "slug"),
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT
  );

CREATE UNIQUE INDEX ON topic ("lang", "slug");

CREATE TABLE
  category (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" BIGINT,
    "slug" TEXT,
    "title" TEXT,
    "description" TEXT,
    "cover" BIGINT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "type" CONTENT DEFAULT 'article',
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("cover") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    UNIQUE ("lang", "slug")
  );

CREATE UNIQUE INDEX ON category ("lang", "slug");

CREATE INDEX ON category ("title");

CREATE TABLE
  article (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" BIGINT,
    "slug" TEXT,
    "title" TEXT,
    "subtitle" TEXT,
    "cover" BIGINT,
    "abstract" TEXT,
    "content" JSON,
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "is_premium" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "category" BIGINT,
    "topic" BIGINT,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("cover") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("topic") REFERENCES topic ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE ("lang", "slug")
  );

CREATE UNIQUE INDEX ON article ("lang", "slug");

CREATE INDEX ON article ("title");

CREATE TABLE
  thought (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "slug" UUID DEFAULT gen_random_uuid (),
    "content" TEXT DEFAULT '',
    "location" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "topic" BIGINT,
    FOREIGN KEY ("topic") REFERENCES topic ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE ("slug")
  );

CREATE UNIQUE INDEX ON thought ("slug");

CREATE TABLE
  thought_image (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "thought_id" BIGINT,
    "image_id" BIGINT,
    FOREIGN KEY ("thought_id") REFERENCES thought ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("image_id") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX ON thought_image ("thought_id");

CREATE TABLE
  photo (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" BIGINT,
    "slug" TEXT,
    "title" TEXT,
    "description" JSON,
    "abstract" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "update_at" TIMESTAMPTZ,
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "cover_index" SMALLINT DEFAULT 0,
    "category" BIGINT,
    "topic" BIGINT,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("topic") REFERENCES topic ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE ("lang", "slug")
  );

CREATE UNIQUE INDEX ON photo ("lang", "slug");

CREATE INDEX ON photo ("title");

CREATE TABLE
  photo_image (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "photo_id" BIGINT,
    "image_id" BIGINT,
    FOREIGN KEY ("photo_id") REFERENCES photo ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("image_id") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX ON photo_image ("photo_id");

CREATE TABLE
  video (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" BIGINT,
    "slug" TEXT,
    "title" TEXT,
    "description" JSON,
    "abstract" TEXT,
    "link" TEXT,
    "embed" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "update_at" TIMESTAMPTZ,
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "cover" BIGINT,
    "category" BIGINT,
    "topic" BIGINT,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("cover") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("topic") REFERENCES topic ("id") ON UPDATE CASCADE ON DELETE RESTRICT
  );

CREATE UNIQUE INDEX ON video ("lang", "slug");

CREATE INDEX ON video ("title");

CREATE TABLE
  comment (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "user_id" BIGINT,
    "toxic_score" SMALLINT,
    "content" JSON,
    "to_article" BIGINT,
    "to_thought" BIGINT,
    "to_photo" BIGINT,
    "to_video" BIGINT,
    "is_blocked" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "reply_to" BIGINT DEFAULT 0,
    "upvote" INT DEFAULT 0,
    "downvote" INT DEFAULT 0,
    "is_anonymous" BOOLEAN DEFAULT false,
    FOREIGN KEY ("user_id") REFERENCES users ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("reply_to") REFERENCES comment ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("to_article") REFERENCES article ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_thought") REFERENCES thought ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_photo") REFERENCES photo ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_video") REFERENCES video ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX ON comment (
  "user_id",
  "to_article",
  "to_thought",
  "to_photo",
  "to_video"
);

ALTER TABLE comment
ADD CONSTRAINT check_comment_can_only_reply_to_one_content CHECK (
  (
    CASE
      WHEN to_article IS NOT NULL THEN 1
      ELSE 0
    END + CASE
      WHEN to_photo IS NOT NULL THEN 1
      ELSE 0
    END + CASE
      WHEN to_video IS NOT NULL THEN 1
      ELSE 0
    END + CASE
      WHEN to_thought IS NOT NULL THEN 1
      ELSE 0
    END
  ) = 1
);

CREATE TABLE
  message (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "message" TEXT,
    "name" TEXT,
    "contact_type" COMMUNICATION DEFAULT 'email',
    "contact_detail" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "is_read" BOOLEAN DEFAULT false
  );

CREATE TABLE
  stats (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "date" DATE DEFAULT NOW() UNIQUE,
    "post_article" INT DEFAULT 0,
    "post_photo" INT DEFAULT 0,
    "post_video" INT DEFAULT 0,
    "post_thought" INT DEFAULT 0,
    "upload_picture" INT DEFAULT 0,
    "comment" INT DEFAULT 0,
    "message" INT DEFAULT 0,
    "new_user" INT DEFAULT 0,
    "character" INT DEFAULT 0
  );

CREATE UNIQUE INDEX ON stats ("date");

CREATE TABLE
  link (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "url" TEXT,
    "title" TEXT,
    "description" TEXT,
    "og_image" TEXT,
    "content" TEXT,
    "screenshot" TEXT,
    "click_count" INT DEFAULT 0,
    "crawl_at" TIMESTAMPTZ DEFAULT NOW()
  );

CREATE INDEX ON link ("url");

CREATE TABLE
  notification (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "user_id" BIGINT,
    "content" TEXT,
    "link" TEXT,
    "is_read" BOOLEAN DEFAULT false,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    FOREIGN KEY ("user_id") REFERENCES users ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX ON notification ("user_id");

-- 函数和触发器
CREATE
OR REPLACE FUNCTION manage_default_language () RETURNS TRIGGER AS $$
BEGIN
    -- 处理INSERT和UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_default IS TRUE THEN
        UPDATE language SET is_default = false WHERE id != NEW.id;
    END IF;

    -- 处理DELETE
    IF TG_OP = 'DELETE' AND OLD.is_default IS TRUE THEN
        -- 找到下一个id最小的行，设置其is_default为true
        UPDATE language
        SET is_default = true
        WHERE id = (
            SELECT id FROM language
            ORDER BY id ASC
            LIMIT 1
        );
    END IF;

    -- 对于INSERT和UPDATE操作，返回新的记录
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        RETURN NEW;
    -- 对于DELETE操作，不需要返回记录
    ELSE
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER manage_default_language BEFORE INSERT
OR
UPDATE
OR DELETE ON language FOR EACH ROW
EXECUTE FUNCTION manage_default_language ();

-- 同步auth新用户信息
CREATE
OR REPLACE FUNCTION sync_new_user () RETURNS TRIGGER AS $$
declare
  count_users int;
begin
  -- Count the number of users in the public.users table
  select count(*) into count_users from public.users;

  -- Insert a new record into public.users
  insert into public.users (user_id, name, source, role)
  values (
    new.id,
    new.raw_user_meta_data->>'name',
    new.raw_app_meta_data->>'provider',
    case
      when count_users > 0 then 'reader'::public.role
      else 'admin'::public.role
    end
  );

  return new;
end;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
AFTER INSERT ON auth.users FOR EACH ROW
EXECUTE PROCEDURE sync_new_user ();

ALTER TABLE article ENABLE ROW LEVEL SECURITY;

ALTER TABLE category ENABLE ROW LEVEL SECURITY;

ALTER TABLE comment ENABLE ROW LEVEL SECURITY;

ALTER TABLE image ENABLE ROW LEVEL SECURITY;

ALTER TABLE language ENABLE ROW LEVEL SECURITY;

ALTER TABLE link ENABLE ROW LEVEL SECURITY;

ALTER TABLE message ENABLE ROW LEVEL SECURITY;

ALTER TABLE notification ENABLE ROW LEVEL SECURITY;

ALTER TABLE photo ENABLE ROW LEVEL SECURITY;

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

ALTER TABLE thought ENABLE ROW LEVEL SECURITY;

ALTER TABLE topic ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE video ENABLE ROW LEVEL SECURITY;

ALTER TABLE thought_image ENABLE ROW LEVEL SECURITY;

ALTER TABLE photo_image ENABLE ROW LEVEL SECURITY;

ALTER TABLE config ENABLE ROW LEVEL SECURITY;

create
or replace function public.is_admin () returns boolean language plpgsql security definer as $$
begin
  return exists (
    select 1 from public.users
    where (select auth.uid()) = user_id and role = 'admin'
  );
end;
$$;

create
or replace function public.user_is_comment_owner () returns boolean language plpgsql security definer as $$
begin
return exists (
  select 1 from public.comment
  join public.users on public.users.id = public.comment.user_id
  where auth.uid() = public.users.user_id
);
end;
$$;

-- 文章
create policy "Get All articles" on public.article for
select
  to anon using (not is_draft);

create policy "Manage Articles" on public.article for all to authenticated using (is_admin ());

-- 摄影
create policy "Get All Albums" on public.photo for
select
  to anon using (not is_draft);

create policy "Manage Albums" on public.photo for all to authenticated using (is_admin ());

create policy "Get Photos of Album" on public.photo_image for
select
  to anon using (true);

create policy "Manage Photos of Album" on public.photo_image for all to authenticated using (is_admin ());

-- 视频
create policy "Get All Videos" on public.video for
select
  to anon using (not is_draft);

create policy "Manage Videos" on public.video for all to authenticated using (is_admin ());

-- 想法
create policy "Get All Thoughts" on public.thought for
select
  to anon using (true);

create policy "Manage Thoughts" on public.thought for all to authenticated using (is_admin ());

create policy "Get Photos of Thought" on public.thought_image for
select
  to anon using (true);

create policy "Manage Photos of Thought" on public.thought_image for all to authenticated using (is_admin ());

-- 分类
create policy "Get All Category" on public.category for
select
  to anon using (true);

create policy "Manage Category" on public.category for all to authenticated using (is_admin ());

-- 评论
create policy "List All Comments" on public.comment for
select
  to anon using (not is_blocked);

create policy "Authenticated User Can Comment" on public.comment for insert to authenticated
with
  check (true);

create policy "Delete Their Own Comments" on public.comment for delete to authenticated using (user_is_comment_owner ());

create policy "Manage Comments" on public.comment for all to authenticated using (is_admin ());

-- 配置
create policy "Manage Configs" on public.config for all to authenticated using (is_admin ());

-- 图片
create policy "Get Images" on public.image for
select
  to anon using (true);

create policy "Manage Images" on public.image for all to authenticated using (is_admin ());

-- 语言
create policy "Get Languages" on public.language for
select
  to anon using (true);

create policy "Manage Languages" on public.language for all to authenticated using (is_admin ());

-- 链接
create policy "Get Links" on public.link for
select
  to anon using (true);

create policy "Manage Links" on public.link for all to authenticated using (is_admin ());

-- 信息
create policy "Send Message" on public.message for insert to authenticated
with
  check (true);

create policy "Manage Message" on public.message for all to authenticated using (is_admin ());

-- 统计数据
create policy "Get Stats" on public.stats for
select
  to anon using (true);

-- 专题
create policy "Get Topics" on public.topic for
select
  to anon using (true);

create policy "Manage Topics" on public.topic for all to authenticated using (is_admin ());

-- 用户
create policy "Manage Users" on public.users for all to authenticated using (is_admin ());

create policy "Update User Info" on public.users
for update
  to authenticated using (
    (
      select
        auth.uid ()
    ) = user_id
  )
with
  check (
    (
      select
        auth.uid ()
    ) = user_id
  );
