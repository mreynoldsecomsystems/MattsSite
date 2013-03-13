namespace WebSite.Migrations
{
    using System;
    using System.Data.Entity.Migrations;
    
    public partial class AddTopic : DbMigration
    {
        public override void Up()
        {
            CreateTable(
                "dbo.Topics",
                c => new
                    {
                        TopicID = c.Int(nullable: false, identity: true),
                        TopicToken = c.String(),
                        TopicName = c.String(),
                        Body = c.String(),
                    })
                .PrimaryKey(t => t.TopicID);
            
        }
        
        public override void Down()
        {
            DropTable("dbo.Topics");
        }
    }
}
