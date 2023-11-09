% Tanque 0
:- module(tanque0, [obter_controles/2]).

%% Explicação:
% Sensores:
% X: posição horizontal do tanque
% Y: posiçao vertical do tanque
% ANGLE: angulo de inclinacao do robo: 0 para virado para frente até PI*2 (~6.28)
% Sensores: esquerda (E1,E2), centro (C3), direita (D4,D5), ré (R6)
%   E1,E2,C3,D4,D5,R6: valores de 0 à 1, onde 0 indica sem obstáculo e 1 indica tocando o tanque
% SCORE: inteiro com a "vida" do tanque. Em zero, ele perdeu
% Controles:
% [FORWARD, REVERSE, LEFT, RIGHT, BOOM]
% FORWARD: 1 para ir pra frente e 0 para não ir
% REVERSE: 1 para ir pra tras e 0 para não ir
% LEFT: 1 para ir pra esquerda e 0 para não ir
% RIGHT: 1 para ir pra direita e 0 para não ir
% BOOM: 1 para tentar disparar (BOOM), pois ele só pode disparar uma bala a cada segundo
% obter_controles([X,Y,ANGLE,E1,E2,C3,D4,D5,R6], [FORWARD, REVERSE, LEFT, RIGHT, BOOM]) :-
%     FORWARD is 1,
%     REVERSE is 0,
%     LEFT is 1,
%     RIGHT is 0,
%     BOOM is 1.

%%% Faça seu codigo a partir daqui, sendo necessario sempre ter o predicado:
%%%% obter_controles([X,Y,ANGLE,E1,E2,C3,D4,D5,R6,SCORE], [FORWARD, REVERSE, LEFT, RIGHT, BOOM]) :- ...

troca(0, 1).
troca(1, 0).
% [FORWARD, REVERSE, LEFT, RIGHT, BOOM]
obter_controles([X,Y,ANGLE,S1,S2,S3,S4,S5,S6,SCORE], [FORWARD, REVERSE, LEFT, RIGHT, BOOM]) :-
    move,
    shoot,
    avoid_collision,
    detect_enemy,
    FORWARD is 1,
    REVERSE is 0,
    LEFT is 1,
    RIGHT is 0,
    BOOM is 1.

%obter_controles([X,Y,ANGLE,E1,E2,C3,D4,D5,R6,SCORE], [FORWARD, REVERSE, LEFT, RIGHT, BOOM]) :-
%deve girar procurando algum inimigo para atirar e assim que achar, atirar
    % SCORE > 0,
    % FORWARD is 0,
    % BOOM is 1,
    % REVERSE is 1,
    % LEFT is 0,
    % RIGHT is 0.

% % Para evitar erros, o tanque para:
obter_controles(_, [0,0,0,0,0]).
