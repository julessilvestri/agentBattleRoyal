from enum import Enum

class ACTION(Enum):
    HIT = 0
    BLOCK = 1
    DODGE = 2
    FLY = 3

def actionToStr(action):
    r = None
    if action == ACTION.HIT: # FRAPPER
        r = 0
    elif action == ACTION.BLOCK: # BLOQUER
        r = 1
    elif action == ACTION.DODGE: # ESQUIVEZ
        r = 2
    elif action == ACTION.FLY: # VOLER
        r = 3
    return str(r)