# SugarQL 

Users := {id: number, nickname: text, email: text}

Posts := {id: number, content: text, author_id: Users.id}

Comments := {id: number, content: text, post_id: Posts.id, author_id: Users.id}

Users * Posts [Users, desc count(Posts)] [100] 