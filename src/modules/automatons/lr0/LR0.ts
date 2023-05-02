export interface LR0Production {
    leftSide: string;
    rightSide: string[];
}

interface LR0GrammarBase {
    name?: string;
    productions: LR0Production[];
}

export interface LR0RawGrammar extends LR0GrammarBase {}

export interface LR0StandardGrammar extends LR0GrammarBase {
    startCharacter: string;
    nonTerminals: string[];
    terminals: string[];
}

export interface LR0Item extends LR0Production {
    dotPos: number;
}

interface LR0AutomatonStateBase {
    id: number;
    targets: { id: number; transferSymbols: string[] }[];
}

export interface LR0AutomatonState extends LR0AutomatonStateBase {
    itemSet: LR0Item[];
}

export interface LR0Automaton {
    name?: string;
    startId: number;
    endId: number;
    states: LR0AutomatonState[];
    standardGrammar: LR0StandardGrammar;
}

export interface LR0AnalysingPattern {
    currentStepIndex: number;
    stateStack: number[];
    characterStack: string[];
    remainCharacters: string[];
    initialSentence: string;
}

const getItemNextSymbole = (item: LR0Item) => {
    return (
        (item.dotPos < item.rightSide.length && item.rightSide[item.dotPos]) ||
        null
    );
};

export const rawGrammarToStandardGrammar = (rawGrammar: LR0RawGrammar) => {
    const { productions } = rawGrammar;
    const rawNonTerminals = productions.map(production => production.leftSide);

    // const startCharacter = `${rawNonTerminals[0]}'`;

    const nonTerminals = [...rawNonTerminals];

    let standarProductions: LR0Production[] = productions.reduce(
        (acc, production) => {
            const additionalProductions: LR0Production[] =
                production.rightSide.map(str => {
                    return {
                        leftSide: production.leftSide,
                        rightSide: str.split(" ").filter(item => item !== "")
                    };
                });
            return [...acc, ...additionalProductions];
        },
        [] as LR0Production[]
    );

    const repeatTerminals = standarProductions.reduce((acc, production) => {
        const additionalTerminals = production.rightSide.filter(
            item =>
                nonTerminals.findIndex(nonTerminal => nonTerminal === item) ===
                -1
        );
        return [...acc, ...additionalTerminals];
    }, [] as string[]);
    const terminals = repeatTerminals.filter(
        (terminal, index) =>
            repeatTerminals.findIndex(item => item === terminal) === index
    );

    const rightSymbols = standarProductions.reduce((acc, production) => {
        return [...acc, ...production.rightSide];
    }, [] as string[]);
    let startCharacter = "";
    nonTerminals.forEach(nonTerminal => {
        if (rightSymbols.findIndex(symbol => symbol === nonTerminal) === -1) {
            startCharacter = nonTerminal;
        }
    });
    standarProductions = [
        { leftSide: `${startCharacter}'`, rightSide: [startCharacter] },
        ...standarProductions
    ];
    startCharacter = `${startCharacter}'`;

    const standardGrammar: LR0StandardGrammar = {
        ...rawGrammar,
        productions: standarProductions,
        startCharacter: startCharacter,
        nonTerminals: nonTerminals,
        terminals: terminals
    };

    return standardGrammar;
};

const itemEquals = (a: LR0Item, b: LR0Item) => {
    if (a.leftSide !== b.leftSide) return false;
    if (a.dotPos !== b.dotPos) return false;
    if (a.rightSide.length !== a.rightSide.length) return false;
    for (let i = 0; i < a.rightSide.length; i++) {
        if (a.rightSide[i] !== b.rightSide[i]) return false;
    }
    return true;
};

const LR0Closure = (
    iniItemSet: LR0Item[],
    standardGrammar: LR0StandardGrammar
) => {
    const { productions, terminals, nonTerminals } = standardGrammar;

    let currentItemSet: LR0Item[] = [...iniItemSet];
    let previousItemSet: LR0Item[] = [];

    while (currentItemSet.length !== previousItemSet.length) {
        previousItemSet = [...currentItemSet];
        const nextItemSet = [...currentItemSet];

        currentItemSet.forEach(item => {
            const name = getItemNextSymbole(item);
            if (
                name &&
                nonTerminals.findIndex(terminal => terminal === name) !== -1
            ) {
                productions
                    .filter(production => production.leftSide === name)
                    .forEach(production => {
                        const newItem: LR0Item = {
                            ...production,
                            dotPos: 0
                        };

                        if (
                            nextItemSet.findIndex(item =>
                                itemEquals(item, newItem)
                            ) === -1
                        ) {
                            nextItemSet.push(newItem);
                        }
                    });
            }
        });
        currentItemSet = [...nextItemSet];
        // console.log("current item set", currentItemSet);
    }
    return currentItemSet;
};

const LR0Goto = (
    initialItemSet: LR0Item[],
    transferSymbol: string,
    standardGrammar: LR0StandardGrammar
) => {
    const targetItemSet: LR0Item[] = [];

    initialItemSet.forEach(item => {
        const name = getItemNextSymbole(item);
        if (name === transferSymbol) {
            targetItemSet.push({
                ...item,
                dotPos: item.dotPos + 1
            });
        }
    });

    return LR0Closure(targetItemSet, standardGrammar);
};

const LR0States = (standardGrammar: LR0StandardGrammar) => {
    const { nonTerminals, terminals } = standardGrammar;

    const initItemSet: LR0Item[] = [
        {
            ...standardGrammar.productions[0],
            dotPos: 0
        }
    ];

    let currentStates: LR0Item[][] = [LR0Closure(initItemSet, standardGrammar)];
    let graph: LR0AutomatonStateBase[] = [{ id: 0, targets: [] }];
    const symbols = [...nonTerminals, ...terminals];

    const itemSetEqual = (a: LR0Item[], b: LR0Item[]) => {
        if (a.length !== b.length) return false;

        for (let i = 0; i < a.length; i++) {
            if (b.findIndex(item => itemEquals(item, a[i])) === -1) {
                return false;
            }
        }
        return true;
    };

    while (true) {
        const newStates = [...currentStates];

        currentStates.forEach((itemSet, currentItemSetIndex) => {
            symbols.forEach(symbol => {
                const newItemSet = LR0Goto(itemSet, symbol, standardGrammar);

                if (newItemSet.length !== 0) {
                    const newItemSetIndex = newStates.findIndex(state =>
                        itemSetEqual(state, newItemSet)
                    );
                    if (newItemSetIndex === -1) {
                        const newId = newStates.length;
                        newStates.push(newItemSet);
                        graph.push({ id: newId, targets: [] });

                        graph[currentItemSetIndex].targets.push({
                            id: newId,
                            transferSymbols: [symbol]
                        });
                    } else {
                        const targetId = newItemSetIndex;
                        const linkIndex = graph[
                            currentItemSetIndex
                        ].targets.findIndex(target => target.id === targetId);

                        if (linkIndex === -1) {
                            graph[currentItemSetIndex].targets.push({
                                id: targetId,
                                transferSymbols: [symbol]
                            });
                        } else {
                            graph[currentItemSetIndex].targets[
                                linkIndex
                            ].transferSymbols.findIndex(
                                transferSymbol => transferSymbol === symbol
                            ) === -1 &&
                                graph[currentItemSetIndex].targets[
                                    linkIndex
                                ].transferSymbols.push(symbol);
                        }
                    }
                }
            });
        });

        if (newStates.length === currentStates.length) break;
        currentStates = newStates;
    }

    let automatonStates: LR0AutomatonState[] = [];

    currentStates.forEach((state, index) => {
        automatonStates = [
            ...automatonStates,
            {
                id: graph[index].id,
                itemSet: state,
                targets: graph[index].targets.map(target => ({
                    id: target.id,
                    transferSymbols: [...target.transferSymbols]
                }))
            }
        ];
    });

    return automatonStates;
};

export const AnalyseLR0Grammar: (
    grammar: LR0RawGrammar
) => LR0Automaton = grammar => {
    const standardGrammar = rawGrammarToStandardGrammar(grammar);

    const states = LR0States(standardGrammar);
    let startId = -1;
    let endId = -1;
    states.forEach(state => {
        state.itemSet.forEach(item => {
            if (item.leftSide === standardGrammar.startCharacter) {
                if (item.dotPos === 0) {
                    startId = state.id;
                } else if (item.dotPos === 1) {
                    endId = state.id;
                }
            }
        });
    });
    const automaton: LR0Automaton = {
        states,
        startId,
        endId,
        standardGrammar
    };

    // console.log(automaton);
    return automaton;
};

export interface ReduceLR0AnalysingPatternResult {
    status: "OK" | "Error" | "Success";
    message: string | null;
}

const ReduceLR0AnalysingPatternForOneStep: (
    previousPattern: LR0AnalysingPattern,
    automaton: LR0Automaton
) => [LR0AnalysingPattern, ReduceLR0AnalysingPatternResult] = (
    previousPattern,
    automaton
) => {
    const {
        stateStack,
        characterStack,
        remainCharacters,
        initialSentence,
        currentStepIndex
    } = previousPattern;
    const currentTopStateId = stateStack[stateStack.length - 1];
    const currentState = automaton.states[currentTopStateId];
    const currentTopCharacter = characterStack[characterStack.length - 1];

    if (currentState.id === automaton.endId) {
        if (remainCharacters[0] === "$") {
            return [
                previousPattern,
                {
                    status: "Success",
                    message: "分析成功"
                }
            ];
        }

        return [
            previousPattern,
            {
                status: "Error",
                message: "自动机卡死"
            }
        ];
    }

    if (stateStack.length !== characterStack.length) {
        const target =
            currentState.targets.find(target => {
                return (
                    target.transferSymbols.findIndex(
                        transferSymbol => transferSymbol === currentTopCharacter
                    ) !== -1
                );
            }) || null;

        if (target === null)
            return [
                previousPattern,
                {
                    status: "Error",
                    message: "自动机卡死"
                }
            ];

        const newPattern: LR0AnalysingPattern = {
            ...previousPattern,
            currentStepIndex: currentStepIndex + 1,
            stateStack: [...stateStack, target.id]
        };
        return [
            newPattern,
            {
                status: "OK",
                message: null
            }
        ];
    }

    const currentNextCharacter = remainCharacters[0];

    const target =
        currentState.targets.find(target => {
            return (
                target.transferSymbols.findIndex(
                    transferSymbol => transferSymbol === currentNextCharacter
                ) !== -1
            );
        }) || null;

    const production =
        currentState.itemSet.find(item => {
            const characterStackStr = characterStack.slice(1).join("");
            if (characterStackStr.endsWith(item.rightSide.join(""))) {
                return true;
            }
            return false;
        }) || null;

    if (target !== null && production !== null) {
        return [
            previousPattern,
            {
                status: "Error",
                message: "出现移入-规约冲突"
            }
        ];
    }

    if (target !== null) {
        const newPattern: LR0AnalysingPattern = {
            currentStepIndex: currentStepIndex + 1,
            stateStack: [...stateStack, target.id],
            characterStack: [...characterStack, currentNextCharacter],
            remainCharacters: remainCharacters.slice(1),
            initialSentence: initialSentence
        };
        return [
            newPattern,
            {
                status: "OK",
                message: null
            }
        ];
    }

    if (production !== null) {
        let characterStackStr = characterStack.join("");
        let newCharacterStackStr = characterStackStr.slice(
            0,
            characterStackStr.length - production.rightSide.join("").length
        );
        let newCharacterStack = [...newCharacterStackStr, production.leftSide];
        let newStateStack = stateStack.slice(0, newCharacterStack.length - 1);
        const newPattern: LR0AnalysingPattern = {
            ...previousPattern,
            currentStepIndex: currentStepIndex + 1,
            stateStack: newStateStack,
            characterStack: newCharacterStack
        };
        return [
            newPattern,
            {
                status: "OK",
                message: null
            }
        ];
    }

    return [
        previousPattern,
        {
            status: "Error",
            message: "自动机卡死"
        }
    ];
};

export const ReduceLR0AnalysingPattern: (
    previousPattern: LR0AnalysingPattern,
    automaton: LR0Automaton,
    stepNumber: number
) => [LR0AnalysingPattern, ReduceLR0AnalysingPatternResult] = (
    previousPattern,
    automaton,
    stepNumber = 1
) => {
    let currentPattern = previousPattern;
    let res: ReduceLR0AnalysingPatternResult = {
        status: "OK",
        message: null
    };
    for (let i = 0; i < stepNumber; i++) {
        [currentPattern, res] = ReduceLR0AnalysingPatternForOneStep(
            currentPattern,
            automaton
        );
        if (res.status === "Error") break;
    }
    return [currentPattern, res];
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

export interface GrammarCheckResult {
    standardGrammar: LR0StandardGrammar;
    errorMessages: string[];
}

export const checkRawGrammar: (
    grammar: LR0RawGrammar
) => GrammarCheckResult = grammar => {
    const standardGrammar = rawGrammarToStandardGrammar(grammar);
    const { productions, nonTerminals } = standardGrammar;
    const startSymbols: string[] = [];

    const errorMessages: string[] = [];

    const leftSymbols = productions.map(production => production.leftSide);

    const rightSymbols = productions.reduce((acc, production) => {
        return [...acc, ...production.rightSide.map(symbol => symbol)];
    }, [] as string[]);

    leftSymbols.forEach(leftSymbol => {
        if (
            rightSymbols.findIndex(
                rightSymbol => leftSymbol === rightSymbol
            ) === -1 &&
            startSymbols.findIndex(
                startSymbol => startSymbol === leftSymbol
            ) === -1
        ) {
            startSymbols.push(leftSymbol);
        }
    });

    if (startSymbols.length > 1) {
        errorMessages.push(
            `合法的文法应该只包含一个开始符号，但是现在有 ${
                startSymbols.length
            } 个：${startSymbols.join("，")}`
        );
    }

    rightSymbols.forEach(rightSymbol => {
        const isNonterminal =
            nonTerminals.findIndex(
                nonTerminal => nonTerminal === rightSymbol
            ) !== -1;

        const hasDefination =
            leftSymbols.findIndex(leftSymbol => leftSymbol === rightSymbol) !==
            -1;

        if (isNonterminal && !hasDefination)
            errorMessages.push(`缺少定义非终结符 ${rightSymbol} 的产生式`);
    });

    const res: GrammarCheckResult = {
        standardGrammar: standardGrammar,
        errorMessages
    };

    return res;
};
