import React from 'react';
import StockfishEvaluation from '@/components/stockfish/StockfishEvaluation';

interface GameLayoutWrapperProps {
    children: React.ReactNode
}

function GameLayoutWrapper({children}: GameLayoutWrapperProps) {

    return(
        <div className="grid grid-cols-1 md:grid-cols-[1fr_2fr_1fr] gap-4">
            <div className="left-panel">
                <StockfishEvaluation />
            </div>
            {children}
        </div>
    )
}

export default GameLayoutWrapper