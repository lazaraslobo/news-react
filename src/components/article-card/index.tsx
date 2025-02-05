import React from 'react';
import './styles.scss';
import { EachArticleInformationType } from "../../redux/home-page/dataTypes";

export const ArticleCardComponent: React.FC<EachArticleInformationType> = ({
    source,
    title,
    description,
    url,
    imageSrc,
    publishedAt,
    content,
    topic,
    author,
    whichApi
}) => {

    const truncateText = (text: string, maxLength = 100) => {
        return text.length > maxLength
            ? `${text.slice(0, maxLength)}...`
            : text;
    };

    return (
        <div className="article-card">
            <div className="article-card-image">
                <img src={imageSrc} alt={title} />
            </div>
            <div className="article-card-content">
                <h2>{truncateText(title, 35)}</h2>
                <p>{truncateText(description, 75)}</p>
                <div className="article-info">
                    <span>{source || "-"}</span> ●
                    <span>{topic || "-"}</span> ●
                    <span>{author || "-"}</span> ●
                    <span>{whichApi || "-"}</span>
                </div>
                <hr />
                <div className="article-footer">
                    <a href={url} target="_blank" className="article-card-cta">
                        OPEN
                    </a>
                    <span>{publishedAt}</span>
                </div>
            </div>
        </div>
    );
};
