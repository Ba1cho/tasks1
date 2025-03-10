import { Component, Input, OnChanges, SimpleChanges, signal, ChangeDetectionStrategy } from '@angular/core';
import { FeedMenuEnum } from "../../../common/models/view/feed.view-model";
import { ArticleService } from "../../../common/services/api/article.service";
import { Article, ArticleResponse, ArticlesResponse, QueryArticlesParams } from "../../../common/models/api/article.model";
import { finalize, Observable } from "rxjs";
import { QUERY_PAGE_SIZE } from "../../../common/constants/default.constant";
import { Router, RouterModule } from '@angular/router';
import { constructLoginUrlTree } from "../../../common/guards/authentication.guard";
import { CommonModule } from '@angular/common';
import { ArticleMetaComponent } from '../article-meta/article-meta.component';

@Component({
  selector: 'app-articles-feed',
  templateUrl: './articles-feed.component.html',
  styleUrl: './articles-feed.component.scss',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    RouterModule,
    ArticleMetaComponent
  ]
})
export class ArticlesFeedComponent implements OnChanges {
  @Input() feedMenuId?: FeedMenuEnum;
  @Input() queryParams?: QueryArticlesParams = {};

  public articles = signal<Article[]>([]);
  public activePageIndex = signal(0);
  public isLoading = signal(true);
  public totalPages = 0;
  public searchTitle: string | null = null;
  
  constructor(
    private readonly _articleService: ArticleService,
    private readonly _router: Router
  ) {
  }
  
  
  
  public ngOnChanges(changes: SimpleChanges) {
    if (changes['feedMenuId']?.currentValue || changes['queryParams']?.currentValue) {
      this.activePageIndex.set(0);
      this._queryFeed();
    }
  }

  public onTitleSearch(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchTitle = input.value;
    console.log(this.searchTitle);
    this.activePageIndex.set(0); // Reset to the first page
    this._queryFeed(); // Re-fetch articles with the new title filter
  }
  

  private _queryFeed(): void {
    this.isLoading.set(true);
    this._constructQueryRequest()
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe((response: ArticlesResponse) => {
        console.log(response);
        this.totalPages = Math.ceil(response.articlesCount / QUERY_PAGE_SIZE);
        this.articles.set(response.articles);
      })
  }

 private _constructQueryRequest(): Observable<ArticlesResponse> {
  const queryParams = {
    ...this.queryParams,
    limit: QUERY_PAGE_SIZE,
    offset: this.activePageIndex() * QUERY_PAGE_SIZE
  };
  console.log(queryParams);
  // Add title to query params if it exists and is not empty
  if (this.searchTitle!==null) {
    queryParams.title = this.searchTitle;
  }

  // Determine which API endpoint to use based on feed menu type
  if (this.feedMenuId === FeedMenuEnum.MINE) {
    return this._articleService.queryFeedArticles(queryParams);
  } else {
    return this._articleService.queryArticles(queryParams);
  }
}

  public loadPagingData(pageIndex: number): void {
    if (this.activePageIndex() === pageIndex) {
      return;
    }

    this.activePageIndex.set(pageIndex);
    this._queryFeed();
  }

  public toggleArticleFavorite(article: Article): void {
    if (!this.articles()) return;

    if (article.favorited) {
      this._articleService.unfavoriteArticle(article.slug).subscribe({
        next: (response: ArticleResponse) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    } else {
      this._articleService.favoriteArticle(article.slug).subscribe({
        next: (response: ArticleResponse) => {
          this._setSingleArticle(response.article);
        },
        error: () => {
          this._router.navigateByUrl(constructLoginUrlTree(this._router));
        }
      });
    }
  }

  private _setSingleArticle(article: Article): void {
    const articleIndex = this.articles().findIndex((a: Article) => a.slug === article.slug);
    this.articles.update((articles: Article[]) => {
      if (articleIndex > -1) {
        articles[articleIndex] = article;
      }

      return [...articles];
    });
  }

  // Метод для сортировки статей по дате
  public sortArticlesByDate(order: 'asc' | 'desc'): void {
    this.articles.update((articles: Article[]) => {
      // Сортировка по дате создания
      articles.sort((a: Article, b: Article) => {
        const dateA = new Date(a.createdAt).getTime();
        const dateB = new Date(b.createdAt).getTime();

        if (order === 'asc') {
          // Сортировка по возрастанию (старые статьи сначала)
          return dateA - dateB;
        } else {
          // Сортировка по убыванию (новейшие статьи сначала)
          return dateB - dateA;
        }
      });

      return [...articles];
    });
  }
}