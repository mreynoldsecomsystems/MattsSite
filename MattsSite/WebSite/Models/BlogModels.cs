using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;

namespace WebSite.Models
{
    public class BlogPost
    {
        public BlogPost()
        {
            this.BlogComments = new HashSet<BlogComment>();
            this.BlogTags = new HashSet<BlogTag>();
        }

        [Key]
        public int BlogPostID { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        [DataType(DataType.Html)]
        public string Message { get; set; }
        public int CreatedByID { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedByID { get; set; }
        public DateTime ModifiedDate { get; set; }

        public virtual ICollection<BlogTag> BlogTags { get; set; }
        public virtual ICollection<BlogComment> BlogComments { get; set; }
        public virtual UserProfile CreatedBy { get; set; }
        public virtual UserProfile ModifiedBy { get; set; }
    }

    public class UserAvatar
    {
        [Key]
        public int UserAvatarID { get; set; }
        public byte[] Avatar { get; set; }
        public int UserProfileID { get; set; }

        public virtual UserProfile UserProfile { get; set; }
    }

    public class BlogComment
    {
        [Key]
        public int BlogCommentID { get; set; }
        public int BlogPostID { get; set; }
        public int CreatedByID { get; set; }
        public DateTime CreatedDate { get; set; }
        public int ModifiedByID { get; set; }
        public DateTime ModifiedDate { get; set; }
        [DataType(DataType.Html)]
        public string Comment { get; set; }

        public virtual UserProfile CreatedBy { get; set; }
        public virtual UserProfile ModifiedBy { get; set; }
        public virtual BlogPost BlogPost { get; set; }
    }

    public class BlogTag
    {
        [Key]
        public int BlogTagID { get; set; }
        public int BlogID { get; set; }
        public int TagID { get; set; }

        public virtual Tag Tag{ get; set; }
        public virtual BlogPost BlogPost { get; set; }
    }

    public class Tag
    {
        [Key]
        public int TagID { get; set; }
        public string TagName { get; set; }
        public int TagCount { get; set; }

        public virtual ICollection<BlogTag> BlogTags { get; set; }
    }
}