import React, { useState } from "react";
import "./styles.scss";

interface AccordionComponentProps {
    heading: string;
    items: { [key: string]: number | any };
    selectionList: string[];
    onClick?: (key: string) => void;
}

const doNothing = (...props: any) => null;

export const AccordionComponent: React.FC<AccordionComponentProps> = ({ heading, items, selectionList, onClick = doNothing }) => {
    const [visibleItemCount, setVisibleItemCount] = useState(15);

    const componentId = `${heading}-accordion`;
    const componentTargetId = `${heading}-target`;

    const handleViewMore = () => {
        setVisibleItemCount(prevCount => prevCount + 15);
    };

    return (
        <div className="accordion" id={componentId}>
            <div className="accordion-item">
                <h2 className="accordion-header" id={componentId}>
                    <button
                        className={`accordion-button ${selectionList.length > 0 && 'selected'}`}
                        type="button"
                        data-bs-toggle="collapse"
                        data-bs-target={`#${componentTargetId}`}
                        aria-expanded="true"
                        aria-controls={componentTargetId}
                    >
                        {heading} - {Object.keys(items).length}
                    </button>
                </h2>
                <div
                    id={componentTargetId}
                    className="accordion-collapse collapse show"
                    aria-labelledby={componentId}
                    data-bs-parent={`#${componentId}`}
                >
                    <div className="accordion-body d-grid">
                        {
                            Object.keys(items)
                                .slice(0, visibleItemCount) // Display only up to visibleItemCount
                                .map((eachKey, index) => (
                                    <div
                                        className={`each-item ${selectionList.includes(eachKey) && 'selected'}`}
                                        key={index}
                                        role="button"
                                        onClick={() => onClick(eachKey)}
                                    >
                                        <span>{eachKey}</span>
                                        {typeof items[eachKey] === 'number' && <span>{items[eachKey]}</span>}
                                    </div>
                                ))
                        }
                        {
                            Object.keys(items).length > visibleItemCount && (
                                <button className="view-more-button" onClick={handleViewMore}>
                                    View More
                                </button>
                            )
                        }
                    </div>
                </div>
            </div>
        </div>
    );
};
