public with sharing class ProductController {
    static Integer pageSize = 9;

    public class Filters {
        @AuraEnabled
        public String searchKey { get; set; }
        @AuraEnabled
        public Decimal maxPrice { get; set; }
        @AuraEnabled
        public String[] family { get; set; }
        
    }

    @AuraEnabled(Cacheable=true)
    public static PagedResult getProducts(Filters filters, Integer pageNumber) {
        String key, 
        whereClause = '';

        Decimal maxPrice;
        String[] family = new List<String>{};
        if (filters != null) {
            maxPrice = filters.maxPrice;
            
            if (!String.isEmpty(filters.searchKey)) {
                key = '%' + filters.searchKey + '%';
                family.add('Name LIKE :key');
            }
            if (filters.maxPrice >= 0) {
                maxPrice = filters.maxPrice;
                family.add('Price__c <= :maxPrice');
            }
            
            if (family.size() > 0) {
                whereClause = 'WHERE ' + String.join(family, ' AND ');
            }
        }
        Integer pageSize = ProductController.pageSize;
        Integer offset = (pageNumber - 1) * pageSize;
        PagedResult result = new PagedResult();
        result.pageSize = pageSize;
        result.pageNumber = pageNumber;
        result.totalItemCount = Database.countQuery(
            'SELECT count() FROM Product2 ' + whereClause
        );
        result.records = Database.query(
            'SELECT Id, Name, Price__c, Description, Family, Photo_URL__c FROM Product2 ' +
            whereClause +
            ' WITH SECURITY_ENFORCED' +
            ' ORDER BY Name LIMIT :pageSize OFFSET :offset'
        );
        return result;
    }

    @AuraEnabled(Cacheable=true)
    public static Product2[] getSimilarProducts(Id productId, Id familyId) {
        return [
            SELECT
                Id,
                Name,
                Price__c,
                Description,
                Family,
                Photo_URL__c
            FROM Product2
            WHERE Family = :familyId AND Id != :productId
            WITH SECURITY_ENFORCED
        ];
    }
}
