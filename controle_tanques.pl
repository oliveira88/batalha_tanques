% Controle dos tanques
:- module(controle_tanques, [vez/3]).

:- use_module(tanque0, [obter_controles/2 as obter_controles0]).
:- use_module(tanque1, [obter_controles/2 as obter_controles1]).
%Exemplo de mais um
%:- use_module(tanque2, [obter_controles/2 as obter_controles2]).

vez(0, SENSORES, CONTROLES) :- obter_controles0(SENSORES,CONTROLES).
vez(1, SENSORES, CONTROLES) :- obter_controles1(SENSORES,CONTROLES).
%Exemplo de mais um
%vez(2, SENSORES, CONTROLES) :- obter_controles2(ENSORES,CONTROLES).

