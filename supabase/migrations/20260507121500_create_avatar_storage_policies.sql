-- Storage bucket and RLS policies for member portraits.
-- Clerk user ids live in the JWT "sub" claim, so policies read auth.jwt()->>'sub'.

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do update set public = excluded.public;

drop policy if exists "Avatar files are publicly readable" on storage.objects;
drop policy if exists "Users can upload their own avatar files" on storage.objects;
drop policy if exists "Users can update their own avatar files" on storage.objects;
drop policy if exists "Users can delete their own avatar files" on storage.objects;

create policy "Avatar files are publicly readable"
on storage.objects
for select
using (bucket_id = 'avatars');

create policy "Users can upload their own avatar files"
on storage.objects
for insert
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.jwt()->>'sub'
);

create policy "Users can update their own avatar files"
on storage.objects
for update
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.jwt()->>'sub'
)
with check (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.jwt()->>'sub'
);

create policy "Users can delete their own avatar files"
on storage.objects
for delete
using (
  bucket_id = 'avatars'
  and (storage.foldername(name))[1] = auth.jwt()->>'sub'
);
