namespace WebSite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class InitialCreate : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.BlogPosts",
                c => new
                    {
                        BlogPostID = c.Int(nullable: false, identity: true),
                        Title = c.String(),
                        Description = c.String(),
                        Message = c.String(),
                        CreatedByID = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByID = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false),
                        CreatedBy_UserId = c.Int(),
                        ModifiedBy_UserId = c.Int(),
                    })
                .PrimaryKey(t => t.BlogPostID)
                .ForeignKey("dbo.UserProfile", t => t.CreatedBy_UserId)
                .ForeignKey("dbo.UserProfile", t => t.ModifiedBy_UserId)
                .Index(t => t.CreatedBy_UserId)
                .Index(t => t.ModifiedBy_UserId);
            
            CreateTable(
                "dbo.BlogTags",
                c => new
                    {
                        BlogTagID = c.Int(nullable: false, identity: true),
                        BlogID = c.Int(nullable: false),
                        TagID = c.Int(nullable: false),
                        BlogPost_BlogPostID = c.Int(),
                    })
                .PrimaryKey(t => t.BlogTagID)
                .ForeignKey("dbo.Tags", t => t.TagID, cascadeDelete: true)
                .ForeignKey("dbo.BlogPosts", t => t.BlogPost_BlogPostID)
                .Index(t => t.TagID)
                .Index(t => t.BlogPost_BlogPostID);
            
            CreateTable(
                "dbo.Tags",
                c => new
                    {
                        TagID = c.Int(nullable: false, identity: true),
                        TagName = c.String(),
                    })
                .PrimaryKey(t => t.TagID);
            
            CreateTable(
                "dbo.BlogComments",
                c => new
                    {
                        BlogCommentID = c.Int(nullable: false, identity: true),
                        BlogPostID = c.Int(nullable: false),
                        CreatedByID = c.Int(nullable: false),
                        CreatedDate = c.DateTime(nullable: false),
                        ModifiedByID = c.Int(nullable: false),
                        ModifiedDate = c.DateTime(nullable: false),
                        Comment = c.String(),
                        CreatedBy_UserId = c.Int(),
                        ModifiedBy_UserId = c.Int(),
                    })
                .PrimaryKey(t => t.BlogCommentID)
                .ForeignKey("dbo.UserProfile", t => t.CreatedBy_UserId)
                .ForeignKey("dbo.UserProfile", t => t.ModifiedBy_UserId)
                .ForeignKey("dbo.BlogPosts", t => t.BlogPostID, cascadeDelete: true)
                .Index(t => t.CreatedBy_UserId)
                .Index(t => t.ModifiedBy_UserId)
                .Index(t => t.BlogPostID);
            
            CreateTable(
                "dbo.UserProfile",
                c => new
                    {
                        UserId = c.Int(nullable: false, identity: true),
                        UserName = c.String(),
                    })
                .PrimaryKey(t => t.UserId);
            
            CreateTable(
                "dbo.UserAvatars",
                c => new
                    {
                        UserAvatarID = c.Int(nullable: false, identity: true),
                        Avatar = c.Binary(),
                        UserProfileID = c.Int(nullable: false),
                        UserProfile_UserId = c.Int(),
                    })
                .PrimaryKey(t => t.UserAvatarID)
                .ForeignKey("dbo.UserProfile", t => t.UserProfile_UserId)
                .Index(t => t.UserProfile_UserId);
            
        }
        
        public override void Down()
        {
            DropIndex("dbo.UserAvatars", new[] { "UserProfile_UserId" });
            DropIndex("dbo.BlogComments", new[] { "BlogPostID" });
            DropIndex("dbo.BlogComments", new[] { "ModifiedBy_UserId" });
            DropIndex("dbo.BlogComments", new[] { "CreatedBy_UserId" });
            DropIndex("dbo.BlogTags", new[] { "BlogPost_BlogPostID" });
            DropIndex("dbo.BlogTags", new[] { "TagID" });
            DropIndex("dbo.BlogPosts", new[] { "ModifiedBy_UserId" });
            DropIndex("dbo.BlogPosts", new[] { "CreatedBy_UserId" });
            DropForeignKey("dbo.UserAvatars", "UserProfile_UserId", "dbo.UserProfile");
            DropForeignKey("dbo.BlogComments", "BlogPostID", "dbo.BlogPosts");
            DropForeignKey("dbo.BlogComments", "ModifiedBy_UserId", "dbo.UserProfile");
            DropForeignKey("dbo.BlogComments", "CreatedBy_UserId", "dbo.UserProfile");
            DropForeignKey("dbo.BlogTags", "BlogPost_BlogPostID", "dbo.BlogPosts");
            DropForeignKey("dbo.BlogTags", "TagID", "dbo.Tags");
            DropForeignKey("dbo.BlogPosts", "ModifiedBy_UserId", "dbo.UserProfile");
            DropForeignKey("dbo.BlogPosts", "CreatedBy_UserId", "dbo.UserProfile");
            DropTable("dbo.UserAvatars");
            DropTable("dbo.UserProfile");
            DropTable("dbo.BlogComments");
            DropTable("dbo.Tags");
            DropTable("dbo.BlogTags");
            DropTable("dbo.BlogPosts");
        }
    }
}
