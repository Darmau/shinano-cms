CREATE TYPE ROLE AS ENUM('admin', 'reader', 'banned');

CREATE TYPE CONTENT AS ENUM('article', 'photo', 'video', 'thought');

CREATE TYPE COMMUNICATION AS ENUM('email', 'wechat', 'telegram', 'twitter', 'line');

CREATE TABLE
  language (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "lang" TEXT UNIQUE,
    "locale" TEXT UNIQUE,
    "is_default" BOOLEAN DEFAULT false
  );

INSERT INTO
  language ("lang", "locale", "is_default")
VALUES
  ('zh-CN', '简体中文', TRUE);

CREATE TABLE
  users (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "name" TEXT,
    "user_id" UUID UNIQUE,
    "source" TEXT,
    "current_ip" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "role" ROLE DEFAULT 'reader',
    FOREIGN KEY ("user_id") REFERENCES auth.users ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE TABLE
  image (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "file_name" TEXT,
    "alt" TEXT,
    "caption" TEXT,
    "folder" TEXT,
    "location" TEXT,
    "date" TEXT,
    "format" TEXT,
    "exif" JSON,
    "taken_at" TIMESTAMPTZ,
    "size" INT,
    "width" INT,
    "height" INT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "storage_key" UUID NOT NULL DEFAULT uuid_generate_v4 () UNIQUE
  );

CREATE INDEX ON image ("taken_at");

CREATE INDEX ON image ("date");

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
    UNIQUE ("lang", "slug", "type")
  );

CREATE INDEX ON category ("title");

CREATE INDEX ON category ("slug");

INSERT INTO
  category ("lang", "slug", "title", "description", "type")
VALUES
  (1, 'default', '默认分类', '所有内容必须归属为一个分类', 'article');

INSERT INTO
  category ("lang", "slug", "title", "description", "type")
VALUES
  (1, 'default', '默认分类', '所有内容必须归属为一个分类', 'photo');

INSERT INTO
  category ("lang", "slug", "title", "description", "type")
VALUES
  (1, 'default', '默认分类', '所有内容必须归属为一个分类', 'video');

CREATE TABLE
  article (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "title" TEXT,
    "subtitle" TEXT,
    "lang" BIGINT,
    "slug" TEXT,
    "content_text" TEXT,
    "abstract" TEXT,
    "cover" BIGINT,
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "is_premium" BOOLEAN DEFAULT false,
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "published_at" TIMESTAMPTZ,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "category" BIGINT,
    "topic" TEXT[],
    "content_json" JSON,
    "content_html" TEXT,
    "page_view" INT DEFAULT 0,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("cover") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE ("lang", "slug")
  );

CREATE INDEX ON article ("lang");

CREATE INDEX ON article ("category");

CREATE INDEX ON article ("slug");

CREATE INDEX ON article ("published_at")
WHERE
  "is_draft" = false;

CREATE INDEX ON article ("updated_at");

CREATE INDEX ON article ("is_draft");

CREATE INDEX ON article ("topic");

CREATE INDEX ON article ("page_view");

CREATE TABLE
  thought (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "slug" UUID DEFAULT gen_random_uuid (),
    "content_text" TEXT,
    "location" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "topic" TEXT[],
    "content_json" JSON,
    "content_html" TEXT,
    "page_view" INT DEFAULT 0,
    UNIQUE ("slug")
  );

CREATE INDEX ON thought ("created_at");

CREATE INDEX ON thought ("topic");

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
    "title" TEXT,
    "slug" TEXT,
    "lang" BIGINT,
    "content_text" TEXT,
    "abstract" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "published_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "cover_index" SMALLINT DEFAULT 0,
    "category" BIGINT,
    "topic" TEXT[],
    "content_json" JSON,
    "content_html" TEXT,
    "page_view" INT DEFAULT 0,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    UNIQUE ("lang", "slug")
  );

CREATE INDEX ON photo ("lang");

CREATE INDEX ON photo ("category");

CREATE INDEX ON photo ("slug");

CREATE INDEX ON photo ("published_at")
WHERE
  "is_draft" = false;

CREATE INDEX ON photo ("updated_at");

CREATE INDEX ON photo ("is_draft");

CREATE INDEX ON photo ("page_view");

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
    "content_json" JSON,
    "abstract" TEXT,
    "link" TEXT,
    "embed" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "published_at" TIMESTAMPTZ,
    "updated_at" TIMESTAMPTZ DEFAULT NOW(),
    "is_draft" BOOLEAN DEFAULT true,
    "is_featured" BOOLEAN DEFAULT false,
    "is_top" BOOLEAN DEFAULT false,
    "cover" BIGINT,
    "category" BIGINT,
    "topic" TEXT[],
    "content_html" TEXT,
    "content_text" TEXT,
    "page_view" INT DEFAULT 0,
    FOREIGN KEY ("lang") REFERENCES language ("id") ON UPDATE CASCADE ON DELETE RESTRICT,
    FOREIGN KEY ("cover") REFERENCES image ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("category") REFERENCES category ("id") ON UPDATE CASCADE ON DELETE RESTRICT
  );

CREATE INDEX ON video ("lang");

CREATE INDEX ON video ("category");

CREATE INDEX ON video ("slug");

CREATE INDEX ON video ("published_at")
WHERE
  "is_draft" = false;

CREATE INDEX ON video ("updated_at");

CREATE INDEX ON video ("page_view");

CREATE INDEX ON video ("is_draft");

CREATE TABLE
  comment (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "user_id" BIGINT,
    "toxic_score" SMALLINT,
    "content_json" JSON,
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
    "receive_notification" BOOLEAN DEFAULT false,
    "content_text" TEXT,
    "content_html" TEXT,
    "is_public" BOOLEAN DEFAULT true,
    FOREIGN KEY ("user_id") REFERENCES users ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("reply_to") REFERENCES comment ("id") ON UPDATE CASCADE ON DELETE SET NULL,
    FOREIGN KEY ("to_article") REFERENCES article ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_thought") REFERENCES thought ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_photo") REFERENCES photo ("id") ON UPDATE CASCADE ON DELETE CASCADE,
    FOREIGN KEY ("to_video") REFERENCES video ("id") ON UPDATE CASCADE ON DELETE CASCADE
  );

CREATE INDEX ON comment ("user_id");

CREATE INDEX ON comment ("to_article", "is_public");

CREATE INDEX ON comment ("to_thought", "is_public");

CREATE INDEX ON comment ("to_photo", "is_public");

CREATE INDEX ON comment ("to_video", "is_public");

CREATE INDEX ON comment ("created_at");

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
    "message" JSON,
    "name" TEXT,
    "contact_type" COMMUNICATION DEFAULT 'email',
    "contact_detail" TEXT,
    "created_at" TIMESTAMPTZ DEFAULT NOW(),
    "is_readed" BOOLEAN DEFAULT false
  );

CREATE INDEX ON message ("created_at");

CREATE TABLE
  stats (
    "id" BIGINT GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
    "date" DATE DEFAULT NOW() UNIQUE,
    "article_count" INT DEFAULT 0,
    "photo_count" INT DEFAULT 0,
    "video_count" INT DEFAULT 0,
    "thought_count" INT DEFAULT 0,
    "image_count" INT DEFAULT 0,
    "comment_count" INT DEFAULT 0,
    "message_count" INT DEFAULT 0,
    "user_count" INT DEFAULT 0
  );

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

-- 替换置顶文章
CREATE
OR REPLACE FUNCTION replace_top_article () RETURNS TRIGGER AS $$
BEGIN
    -- 处理INSERT和UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_top IS TRUE THEN
        -- 更新其他具有相同lang且is_top为true的文章
        UPDATE article
        SET is_top = false
        WHERE is_top = true
          AND lang = NEW.lang
          AND id != NEW.id;  -- 排除当前正在插入/更新的文章
    END IF;

    -- 对于INSERT和UPDATE操作,返回新的记录
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        RETURN NEW;
    -- 对于DELETE操作,不需要返回记录
    ELSE
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_switch_top_article BEFORE INSERT
OR
UPDATE ON article FOR EACH ROW
EXECUTE FUNCTION replace_top_article ();

-- 替换置顶摄影
CREATE
OR REPLACE FUNCTION replace_top_photo () RETURNS TRIGGER AS $$
BEGIN
    -- 处理INSERT和UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_top IS TRUE THEN
        -- 更新其他具有相同lang且is_top为true的摄影
        UPDATE photo
        SET is_top = false
        WHERE is_top = true
          AND lang = NEW.lang
          AND id != NEW.id;  -- 排除当前正在插入/更新的
    END IF;

    -- 对于INSERT和UPDATE操作,返回新的记录
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        RETURN NEW;
    -- 对于DELETE操作,不需要返回记录
    ELSE
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_switch_top_photo BEFORE INSERT
OR
UPDATE ON photo FOR EACH ROW
EXECUTE FUNCTION replace_top_photo ();

-- 替换置顶视频
CREATE
OR REPLACE FUNCTION replace_top_video () RETURNS TRIGGER AS $$
BEGIN
    -- 处理INSERT和UPDATE
    IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') AND NEW.is_top IS TRUE THEN
        -- 更新其他具有相同lang且is_top为true的视频
        UPDATE video
        SET is_top = false
        WHERE is_top = true
          AND lang = NEW.lang
          AND id != NEW.id;  -- 排除当前正在插入/更新的
    END IF;

    -- 对于INSERT和UPDATE操作,返回新的记录
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        RETURN NEW;
    -- 对于DELETE操作,不需要返回记录
    ELSE
        RETURN OLD;
    END IF;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_switch_top_video BEFORE INSERT
OR
UPDATE ON video FOR EACH ROW
EXECUTE FUNCTION replace_top_video ();

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

-- 创建语言时同时创建默认分类
CREATE
OR REPLACE FUNCTION insert_default_categories () RETURNS TRIGGER AS $$
BEGIN
  -- 插入article类型的默认分类
  INSERT INTO category (lang, title, description, type, slug)
  VALUES (NEW.id, 'Default', 'Default category', 'article', 'default');

  -- 插入photo类型的默认分类
  INSERT INTO category (lang, title, description, type, slug)
  VALUES (NEW.id, 'Default', 'Default category', 'photo', 'default');

  -- 插入video类型的默认分类
  INSERT INTO category (lang, title, description, type, slug)
  VALUES (NEW.id, 'Default', 'Default category', 'video', 'default');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER insert_default_categories_after_language_created
AFTER INSERT ON language FOR EACH ROW
EXECUTE FUNCTION insert_default_categories ();

-- 如果是匿名评论，is_public设置为false
CREATE
OR REPLACE FUNCTION set_comment_is_public () RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_anonymous = TRUE THEN
    NEW.is_public = FALSE;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_comment_not_public_before_insert BEFORE INSERT ON comment FOR EACH ROW
EXECUTE FUNCTION set_comment_is_public ();

ALTER TABLE article ENABLE ROW LEVEL SECURITY;

ALTER TABLE category ENABLE ROW LEVEL SECURITY;

ALTER TABLE comment ENABLE ROW LEVEL SECURITY;

ALTER TABLE image ENABLE ROW LEVEL SECURITY;

ALTER TABLE language ENABLE ROW LEVEL SECURITY;

ALTER TABLE message ENABLE ROW LEVEL SECURITY;

ALTER TABLE photo ENABLE ROW LEVEL SECURITY;

ALTER TABLE thought ENABLE ROW LEVEL SECURITY;

ALTER TABLE users ENABLE ROW LEVEL SECURITY;

ALTER TABLE video ENABLE ROW LEVEL SECURITY;

ALTER TABLE thought_image ENABLE ROW LEVEL SECURITY;

ALTER TABLE photo_image ENABLE ROW LEVEL SECURITY;

ALTER TABLE stats ENABLE ROW LEVEL SECURITY;

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

create
or replace function public.user_is_blocked () returns boolean language plpgsql security definer as $$
begin
return exists (
  select 1 from public.users
  where (select auth.uid()) = user_id and role = 'banned'
);
end;
$$;

-- 文章
create policy "Get articles for authenticated users" on public.article for
select
  to authenticated using (not is_draft);

create policy "Get limited article info for anonymous users" on public.article for
select
  to anon using (not is_draft);

revoke
select
  on public.article
from
  anon;

grant
select
  (
    id,
    lang,
    slug,
    title,
    subtitle,
    cover,
    abstract,
    is_draft,
    is_featured,
    is_top,
    is_premium,
    category,
    topic,
    page_view,
    updated_at,
    published_at
  ) on public.article to anon;

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

create policy "Authenticated and not blocked User Can Comment" on public.comment for insert to authenticated
with
  check (not user_is_blocked ());

create policy "Delete Their Own Comments" on public.comment for delete to authenticated using (user_is_comment_owner ());

create policy "Manage Comments" on public.comment for all to authenticated using (is_admin ());

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

-- 信息
create policy "Send Message" on public.message for insert to authenticated
with
  check (true);

create policy "Manage Message" on public.message for all to authenticated using (is_admin ());

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

-- 统计
create policy "Get Stats" on public.stats for
select
  to anon using (true);

-- 定时任务
create extension pg_cron
with
  schema extensions;

grant usage on schema cron to postgres;

grant all privileges on all tables in schema cron to postgres;

SELECT
  cron.schedule (
    'daily_stats_update',
    '0 23 * * *',
    $$
  INSERT INTO stats (article_count, photo_count, video_count, thought_count,
  comment_count, message_count, user_count, image_count)
  SELECT
    (SELECT COUNT(*) FROM article),
    (SELECT COUNT(*) FROM photo),
    (SELECT COUNT(*) FROM video),
    (SELECT COUNT(*) FROM thought),
    (SELECT COUNT(*) FROM comment),
    (SELECT COUNT(*) FROM message),
    (SELECT COUNT(*) FROM users),
    (SELECT COUNT(*) FROM image)
    $$
  );

--文章定时发布
SELECT
  cron.schedule (
    'article_schedule_publish',
    '*/5 * * * *',
    $$
  UPDATE article
  SET is_draft = false
  WHERE is_draft = true
    AND published_at IS NOT NULL
    AND published_at <= NOW()
  $$
  );

SELECT
  cron.schedule (
    'photo_schedule_publish',
    '*/5 * * * *',
    $$
UPDATE photo
SET is_draft = false
WHERE is_draft = true
  AND published_at IS NOT NULL
  AND published_at <= NOW()
$$
  );

SELECT
  cron.schedule (
    'video_schedule_publish',
    '*/5 * * * *',
    $$
  UPDATE video
  SET is_draft = false
  WHERE is_draft = true
    AND published_at IS NOT NULL
    AND published_at <= NOW()
  $$
  );

-- 允许全文搜索插件
create extension pgroonga
with
  schema extensions;

create index article_title ON article USING pgroonga (title);

create index article_subtitle ON article USING pgroonga (subtitle);

create index article_abstract ON article USING pgroonga (abstract);

create index article_content ON article USING pgroonga (content_text);

create index photo_title ON photo USING pgroonga (title);

create index photo_abstract ON photo USING pgroonga (abstract);

create index photo_content ON photo USING pgroonga (content_text);

create index video_title ON video USING pgroonga (title);

create index video_abstract ON video USING pgroonga (abstract);

create index video_content ON video USING pgroonga (content_text);

create index thought_content ON thought USING pgroonga (content_text);

create index comment_content ON comment USING pgroonga (content_text);
