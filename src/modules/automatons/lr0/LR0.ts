export interface LR0Production {
    leftSide: string;
    rightSide: string[];
}

export interface LR0Grammar {
    name?: string;
    productions: LR0Production[];
}

export interface LR0AutomatonState {
    id: number;
    itemSet: LR0Production[];
    targets: { id: number; transferCharacters: string[] }[];
}

export interface LR0Automaton {
    name?: string;
    states: LR0AutomatonState[];
}

export interface LR0AnalysingPattern {
    currentStepIndex: number;
    stateStack: number[];
    characterStack: string[];
    remainCharacters: string[];
    initialSentence: string;
}

export const AnalyseLR0Grammer: (
    grammar: LR0Grammar
) => LR0Automaton = grammer => {
    const automaton: LR0Automaton = {
        states: []
    };

    // TODO 从文法构造自动机

    return automaton;
};

export const ReduceLR0AnalysingPattern: (
    previousPattern: LR0AnalysingPattern,
    automaton: LR0Automaton,
    stepNumber: number
) => LR0AnalysingPattern = (previousPattern, automaton, stepNumber) => {
    // TODO 从先前格局推算指定步骤数

    return previousPattern;
};

export const InitialSentenceLR0AnalysingPattern: (
    sentence: string
) => LR0AnalysingPattern = sentence => {
    const pattern: LR0AnalysingPattern = {
        currentStepIndex: 0,
        stateStack: [],
        characterStack: [],
        remainCharacters: sentence.split(""),
        initialSentence: sentence
    };
    return pattern;
};
