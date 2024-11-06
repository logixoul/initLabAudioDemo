// channel voice messages
export const NOTE_OFF = 0x08;
export const NOTE_ON = 0x09;
export const POLYPHONIC_KEY_PRESSURE = 0x0A;
export const CONTROL_CHANGE = 0x0B;
export const PROGRAM_CHANGE = 0x0C;
export const CHANNEL_PRESSURE = 0x0D;
export const PITCH_BEND_CHANGE = 0x0E;

export const CHANNEL_VOICE_MESSAGE_TYPES = {
    [NOTE_OFF]: 'noteoff',
    [NOTE_ON]: 'noteon',
    [POLYPHONIC_KEY_PRESSURE]: 'polyaftertouch',
    [CONTROL_CHANGE]: 'controlchange',
    [PROGRAM_CHANGE]: 'programchange',
    [CHANNEL_PRESSURE]: 'channelaftertouch',
    [PITCH_BEND_CHANGE]: 'pitchbendchange',
};

// channel mode messages
export const ALL_SOUND_OFF = 0x78;
export const RESET_ALL_CONTROLLERS = 0x79;
export const LOCAL_CONTROL = 0x7A;
export const ALL_NOTES_OFF = 0x7B;
export const OMNI_MODE_OFF = 0x7C;
export const OMNI_MODE_ON = 0x7D;
export const MONO_MODE_ON = 0x7E;
export const POLY_MODE_ON = 0x7F;

export const CHANNEL_MODE_MESSAGE_TYPES = {
    [ALL_SOUND_OFF]: 'allsoundoff',
    [RESET_ALL_CONTROLLERS]: 'resetallcontrollers',
    [LOCAL_CONTROL]: 'localcontrol',
    [ALL_NOTES_OFF]: 'allnotesoff',
    [OMNI_MODE_OFF]: 'omnimodeoff',
    [OMNI_MODE_ON]: 'omnimodeon',
    [MONO_MODE_ON]: 'monomodeon',
    [POLY_MODE_ON]: 'polymodeon',
};

// system common messages
export const SYSTEM_EXCLUSIVE = 0xF0;
export const MIDI_TIME_CODE_QUARTER_FRAME = 0xF1;
export const SONG_POSITION_POINTER = 0xF2;
export const SONG_SELECT = 0xF3;
export const SYSTEM_RESERVED_1 = 0xF4;
export const SYSTEM_RESERVED_2 = 0xF5;
export const TUNE_REQUEST = 0xF6;
export const END_OF_EXCLUSIVE = 0xF7;

// system real-time messages
export const TIMING_CLOCK = 0xF8;
export const SYSTEM_RESERVED_3 = 0xF9;
export const START = 0xFA;
export const CONTINUE = 0xFB;
export const STOP = 0xFC;
export const SYSTEM_RESERVED_4 = 0xFD;
export const ACTIVE_SENSING = 0xFE;
export const RESET = 0xFF;

export const SYSTEM_MESSAGE_TYPES = {
    // common
    [SYSTEM_EXCLUSIVE]: 'sysex',
    [MIDI_TIME_CODE_QUARTER_FRAME]: 'mtc',
    [SONG_POSITION_POINTER]: 'songposition',
    [SONG_SELECT]: 'songselect',
    [SYSTEM_RESERVED_1]: 'systemreserved1',
    [SYSTEM_RESERVED_2]: 'systemreserved2',
    [TUNE_REQUEST]: 'tunerequest',
    [END_OF_EXCLUSIVE]: 'sysexend',

    // real-time
    [TIMING_CLOCK]: 'timingclock',
    [SYSTEM_RESERVED_3]: 'systemreserved3',
    [START]: 'start',
    [CONTINUE]: 'continue',
    [STOP]: 'stop',
    [SYSTEM_RESERVED_4]: 'systemreserved4',
    [ACTIVE_SENSING]: 'activesensing',
    [RESET]: 'reset',
};

export const DRUM_CHANNEL_NUMBER = 10;

export function parseMessage(bytes) {
    const msg = {};
    const status = bytes[0];

    if ((status & 0xF0) === 0xF0) {
        // system messages
        msg.type = status;
        msg.name = SYSTEM_MESSAGE_TYPES?.[status];

        switch (status) {
            case SYSTEM_EXCLUSIVE:
                // TODO
                msg.bytes = bytes.slice(1);
                break;
            case MIDI_TIME_CODE_QUARTER_FRAME:
                msg.messageType = (bytes[1] >> 4) & 0x07;
                msg.value = bytes[1] & 0x0F;
                break;
            case SONG_POSITION_POINTER:
                msg.beats = (bytes[2] << 7) | bytes[1];
                break;
            case SONG_SELECT:
                msg.number = bytes[1];
                break;
            case TUNE_REQUEST:
            case END_OF_EXCLUSIVE:
            case TIMING_CLOCK:
            case START:
            case CONTINUE:
            case STOP:
            case ACTIVE_SENSING:
            case RESET:
                // no parameters
                break;
            default:
                console.warn('Unexpected system message', msg);
        }
    }
    else {
        // channel messages
        const type = status >> 4;
        msg.type = type;
        msg.name = CHANNEL_VOICE_MESSAGE_TYPES?.[type];
        msg.channel = (status & 0x0F) + 1;

        switch (type) {
            case NOTE_OFF:
            case NOTE_ON:
                msg.key = bytes[1];
                msg.velocity = bytes[2];
                break;
            case POLYPHONIC_KEY_PRESSURE:
                msg.key = bytes[1];
                msg.pressure = bytes[2];
                break;
            case CONTROL_CHANGE:
                const number = bytes[1];

                if (number > 119) {
                    // channel mode messages
                    msg.isChannelMode = true;
                    msg.name = CHANNEL_MODE_MESSAGE_TYPES[number];

                    switch (number) {
                        case ALL_SOUND_OFF:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for all sound off:', bytes[2]);
                            }
                            break;
                        case RESET_ALL_CONTROLLERS:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for reset all controllers:', bytes[2]);
                            }
                            break;
                        case LOCAL_CONTROL:
                            const value = bytes[2];

                            switch (value) {
                                case 0:
                                    msg.state = false;
                                    break;
                                case 0x7F:
                                    msg.state = false;
                                    break;
                                default:
                                    console.warn('Unexpected value for local control:', value);
                            }
                            break;
                        case ALL_NOTES_OFF:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for all notes off:', bytes[2]);
                            }
                            break;
                        case OMNI_MODE_OFF:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for omni mode off:', bytes[2]);
                            }
                            break;
                        case OMNI_MODE_ON:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for omni mode on:', bytes[2]);
                            }
                            break;
                        case MONO_MODE_ON:
                            msg.channels = bytes[2];
                            break;
                        case POLY_MODE_ON:
                            if (bytes[2] !== 0) {
                                console.warn('Unexpected value for poly mode on:', bytes[2]);
                            }
                            break;
                        default:
                            console.warn('Unexpected channel mode message', msg);
                    }
                }
                else {
                    // controller value change
                    msg.isChannelMode = false;
                    msg.number = number;
                    msg.value = bytes[2];
                }
                break;
            case PROGRAM_CHANGE:
                msg.number = bytes[1];
                break;
            case CHANNEL_PRESSURE:
                msg.pressure = bytes[1];
                break;
            case PITCH_BEND_CHANGE:
                msg.value = (bytes[2] << 7) | bytes[1];
                break;
            default:
                console.warn('Unexpected channel message', msg);
        }
    }

    return msg;
}
