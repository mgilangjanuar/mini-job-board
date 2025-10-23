alter table jobs enable row level security;

create policy "Public read access to jobs" on jobs
    for select
    using (true);

create policy "Users can insert their own jobs" on jobs
    for insert
    with check ((select auth.uid()) = user_id);

create policy "Users can update their own jobs" on jobs
    for update
    using ((select auth.uid()) = user_id)
    with check ((select auth.uid()) = user_id);

create policy "Users can delete their own jobs" on jobs
    for delete
    using ((select auth.uid()) = user_id);
