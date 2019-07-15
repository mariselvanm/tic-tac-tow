import Component from '@ember/component';
import { debounce } from '@ember/runloop';
import { observer, setProperties } from '@ember/object';
import { A } from '@ember/array';

export default Component.extend({
    defaultGridSize: 0,
    isCreateGridDisabled : true,
    startCreatingGrid : false,
    gridTemplate : A([]),
    enableReset : false,

    // Game state Maintain
    isXWin : false,
    isOWin : false,
    isGameDraw : false,
    isGameInProgress : false,

    gridInputChanged : observer('defaultGridSize', function() {
        const checkErrors = () => {
            if(this.defaultGridSize && !isNaN(this.defaultGridSize) && +this.defaultGridSize % 2 !== 0) {
                this.set('isCreateGridDisabled', false);
            } else {
                this.set('isCreateGridDisabled', true);
                this.set('errors', 'Please give a valid number and should be odd');
            }
        }
        debounce(this, checkErrors, 500);
    }),
    init() {
        this._super(...arguments);
        setProperties(this, {
            errors : '',
            tictactoedata : 'O',
        });
    },
    tictactoeValidation() {
        // Here we need to reset the Game Progress flag.
        // Else the state is not changed throwout the entire game
        this.set('isGameInProgress', false);

        let [xDiagnalLeft, oDiagnalLeft,xDiagnalRight, oDiagnalRight] = [0, 0, 0, 0];
        let gridValues = this.gridTemplate;
        
        for(let rowStart = 0; rowStart < +this.defaultGridSize; rowStart++) {
            let [xRowWin, oRowWin, xColWin, oColWin] = [0, 0, 0, 0];
            for(let colStart = 0; colStart < +this.defaultGridSize; colStart++) {
                // For Row Check
                if (gridValues[rowStart][colStart] === 'O') {
                    oRowWin ++;
                } else if (gridValues[rowStart][colStart] === 'X'){
                    xRowWin ++;
                } else {
                    this.set('isGameInProgress', true);
                }

                // For Column Check
                if (gridValues[colStart][rowStart] === 'O') {
                    oColWin ++;
                } else if (gridValues[colStart][rowStart] === 'X') {
                    xColWin ++;
                }

                // For Diagnoal check from left
                if (rowStart === colStart && gridValues[rowStart][colStart] === 'O') {
                    oDiagnalLeft++;
                } else if (rowStart === colStart && gridValues[rowStart][colStart] === 'X') {
                    xDiagnalLeft++;
                }

                //For Diagnoal check from right
                if ((colStart + rowStart) === (+this.defaultGridSize - 1)) {
                    if (gridValues[rowStart][colStart] === 'O') {
                        oDiagnalRight++;
                    } else if(gridValues[rowStart][colStart] === 'X') {
                        xDiagnalRight++;
                    } 
                }
            }

            if (xRowWin === +this.defaultGridSize || xColWin === +this.defaultGridSize) {
                this.set('isXWin', true);
                return;
            }

            if (oRowWin === +this.defaultGridSize || oColWin === +this.defaultGridSize) {
                this.set('isOWin', true);
                return;
            }
        }

        if (xDiagnalLeft === +this.defaultGridSize || xDiagnalRight === +this.defaultGridSize) {
            this.set('isXWin', true);
            return;
        } else if (oDiagnalLeft === +this.defaultGridSize || oDiagnalRight === +this.defaultGridSize) {
            this.set('isOWin', true);
            return;
        } else {
            this.set('isGameDraw', true);
        }
    },
    actions: {
        createGrid() {
            let gridTemplateObject = [...Array(+this.defaultGridSize)];
            gridTemplateObject = gridTemplateObject.map(() => Array(+this.defaultGridSize).fill(''));
            setProperties(this, {
                gridTemplate : gridTemplateObject,
                startCreatingGrid : true,
                enableReset : true,
            });
        },
        fileWithData(...args) {
            const [row, column] = [...args];
            if (event.target.innerText) {
                // Point Error
                return;
            }

            event.target.innerText = this.tictactoedata;
            this.gridTemplate[row][column] = this.tictactoedata;

            if (this.tictactoedata === 'O') {
                this.set('tictactoedata', 'X');
            } else {
                this.set('tictactoedata', 'O');
            }
            
            // call function to check the game validation
            this.tictactoeValidation();
        },
        resetGame() {
            setProperties(this, {
                enableReset: false,
                defaultGridSize: 0,
                isXWin : false,
                isOWin : false,
                isGameDraw : false,
                isGameInProgress : false,
            });
        },
    }
});
