-- 67C
create table thing (
    this serial primary key, 
    that text, 
    theOther varchar(10)
    ) ;

insert into thing (that, theOther) values ('hello', 'what up?');