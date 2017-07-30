package lab3.spring.serpring.model;

import java.io.Serializable;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

/**
 * Objeto série é tratado como Entidade Persistente da JPA.
 * 
 * Possui como atributos especiais o ID da série, que é gerado de forma
 * automática e id de usuário, que indica a qual usuário esta série pertence.
 * 
 * Atributo inProfile indica se a série está no perfil ou na watchlist,
 * retornando true ou false, respectivamente.
 * 
 * Demais atributos são peculiares ao objeto
 *
 */
@Entity
@Table(name = "tb_serie")
public class Serie implements Serializable {

	private static final long serialVersionUID = -1122468476053971910L;
	
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer id;
	
	@NotNull
	@Column(name = "user_id")
	private Integer userId;

	@NotNull
	@Column(name = "in_rofile")
	private Boolean inProfile;
	
	@NotNull
	@Column(name = "imdb_id")
	private String imdbId;
	
	@Column(name = "my_rating")
	private String myRating;
	
	@Column(name = "last_episode")
	private String lastEpisodeWatched;
	
	@Column(name = "title")
	private String title;
	
	@Column(name = "year")
	private String year;
	
	@Column(name = "released")
	private String released;
	
	@Column(name = "actors")
	private String actors;
	
	@Column(name = "plot")
	private String plot;
	
	@Column(name = "awards")
	private String awards;
	
	@Column(name = "poster")
	private String poster;
	
	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getYear() {
		return year;
	}

	public void setYear(String year) {
		this.year = year;
	}

	public String getReleased() {
		return released;
	}

	public void setReleased(String released) {
		this.released = released;
	}

	public String getActors() {
		return actors;
	}

	public void setActors(String actors) {
		this.actors = actors;
	}

	public String getPlot() {
		return plot;
	}

	public void setPlot(String plot) {
		this.plot = plot;
	}

	public String getAwards() {
		return awards;
	}

	public void setAwards(String awards) {
		this.awards = awards;
	}

	public String getPoster() {
		return poster;
	}

	public void setPoster(String poster) {
		this.poster = poster;
	}

	public String getImdbRating() {
		return imdbRating;
	}

	public void setImdbRating(String imdbRating) {
		this.imdbRating = imdbRating;
	}

	@Column(name = "imdb_rating")
	private String imdbRating;

	public static long getSerialversionuid() {
		return serialVersionUID;
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Integer getUserId() {
		return userId;
	}

	public void setUserId(Integer userId) {
		this.userId = userId;
	}

	public Boolean getInProfile() {
		return inProfile;
	}

	public void setInProfile(Boolean inProfile) {
		this.inProfile = inProfile;
	}

	public String getImdbId() {
		return imdbId;
	}

	public void setImdbId(String imdbId) {
		this.imdbId = imdbId;
	}

	public String getMyRating() {
		return myRating;
	}

	public void setMyRating(String myRating) {
		this.myRating = myRating;
	}

	public String getLastEpisodeWatched() {
		return lastEpisodeWatched;
	}

	public void setLastEpisodeWatched(String lastEpisodeWatched) {
		this.lastEpisodeWatched = lastEpisodeWatched;
	}
	
}
