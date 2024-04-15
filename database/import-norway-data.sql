create table kommuner
as
select kommunenummer, kommunenavn, omrade from kommuner_e1b95ab2fb054ee7998946cce6039771.kommune;
alter table kommuner add primary key (kommunenummer);
create index kommune_omrade on kommuner using gist(omrade);

create table adresser
as
select adresseid, adressetekst, adressenavn, nummer, bokstav, representasjonspunkt from matrikkelenadresse_61aead0557254772837979cbfe30ed36.vegadresse;
alter table adresser add primary key (adresseid);
create index adresse_punkt on adresser using gist(representasjonspunkt);